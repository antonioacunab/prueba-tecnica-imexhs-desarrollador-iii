import pandas as pd
import pydicom
import numpy as np

from pathlib import Path
from datetime import datetime
from typing import List, Optional, Tuple
from pydicom.errors import InvalidDicomError
from PIL import Image

class FileProcessor:
    base_path: str
    logger: str

    def __init__ (self, base_path: str, log_file: str):
        self.base_path = base_path
        self.logger = log_file

        return

    def list_folder_contents(self, folder_name: str, details: bool = False):
        full_path = Path(self.base_path) / folder_name

        if not Path.exists(full_path):
            self.log_error(f"The folder '{full_path}' does not exist")

            return

        print("The number of elements is:", len(list(Path.iterdir(full_path))), "\n")

        for content in Path.iterdir(full_path):
            if details:
                name: str = content.name
                type: str = "Dir" if content.is_dir() else "File"
                size_in_mb: float = content.stat().st_size / 1024 ** 2
                date: datetime = datetime.fromtimestamp(content.stat().st_mtime)

                print(name, "\n Type:", type, "\n Size (MB):", size_in_mb, "\n Last modified at:", date, "\n")
            else:
                print(content.name, "Dir" if content.is_dir() else "File")

        return

    def read_csv (self, filename: str, report_path: Optional[str] = None, summary: bool = False) -> None:
        path_to_file: Path = Path(self.base_path) / filename

        can_read_file: bool = path_to_file.exists() and path_to_file.is_file()

        if not can_read_file:
            # Log an error if the file is missing
            self.log_error(f"File not found: {path_to_file}")

            return

        try:
            df: pd.DataFrame = pd.read_csv(path_to_file)
        except Exception as error:
            # Log an error if the file has a bad format
            self.log_error(f"An error occurred while trying to read the CSV file: {error}")

            return

        print(f"\nFile: {path_to_file.name}")
        print(f"Columns ({df.shape[1]}): {', '.join(df.columns)}")
        print(f"Rows: {df.shape[0]}")

        # Numeric columns analysis

        numeric_cols: pd.DataFrame = df.select_dtypes(include='number')

        if numeric_cols.empty:
            self.log_error("There are not numeric columns to calculate the average and the standard deviation.")
        else:
            try:
                averages: pd.Series = numeric_cols.mean()
                deviations: pd.Series = numeric_cols.std()

                print("\n--- Numeric Columns Analysis ---\n")

                for col in numeric_cols.columns:
                    print(f"{col}: Average = {averages[col]:.2f}. Deviation = {deviations[col]:.2f}")

            except Exception as error:
                self.log_error(f"An error occurred while calculating numeric columns statistics: {error}")

                return

            if report_path:
                try:
                    # Save the report if a report_path is provided
                    with open(str(report_path), 'w', encoding='utf-8') as file:
                        file.write("Numeric Cols Analysis:\n")

                        for col in numeric_cols.columns:
                            file.write(f"{col}: Average = {averages[col]:.2f}. Deviation = {deviations[col]:.2f}\n")

                except Exception as error:
                    # Log an error if something were wrong while operating numeric columns
                    self.log_error(f"The report could not be stored at '{report_path}': {error}")

        # Non-numeric columns analysis

        if summary:
            non_numeric_cols: pd.DataFrame = df.select_dtypes(exclude='number')

            if non_numeric_cols.empty:
                print("\nThere are not non-numeric columns to show a summary of")
            else:
                print("\n--- Non-Numeric Columns Analysis ---")

                for col in non_numeric_cols.columns:
                    print(f"\nColumn: {col}")

                    frequencies = non_numeric_cols[col].value_counts()

                    for valor, frecuencia in frequencies.items():
                        print(f"{valor}: {frecuencia}")
        return

    def read_dicom (self, filename: str, tags: Optional[List[Tuple[int, int]]] = None, extract_image: bool = False) -> None:
        path_to_file: Path = Path(self.base_path) / filename

        can_read_file: bool = path_to_file.exists() and path_to_file.is_file()

        if not can_read_file:
            # Log an error if the file is missing
            self.log_error(f"DICOM file not found: {path_to_file}")

            return

        try:
            ds = pydicom.dcmread(path_to_file)
        except InvalidDicomError:
            # Log an error if the file has an invalid format
            self.log_error(f"The DICOM file is not valid: {path_to_file}")

            return
        except Exception as error:
            # Log an error if any other kind of error happens while reading the file
            self.log_error(f"An error occurred while trying to read the DICOM file: {error}")

            return

        # Basic Information
        print(f"\nFile: {path_to_file.name}")
        print(f"Patient's name: {getattr(ds, 'PatientName', 'Not defined')}")
        print(f"Study date: {getattr(ds, 'StudyDate', 'Not defined')}")
        print(f"Modality: {getattr(ds, 'Modality', 'Not defined')}")

        # Optional tags
        if tags:
            print("\n--- Required Tags ---")
            for group, element in tags:
                tag = (group << 16) | element

                if tag in ds:
                    valor = ds[tag].value
                    print(f"Tag ({group:04X}, {element:04X}): {valor}")
                else:
                    print(f"Tag ({group:04X}, {element:04X}) no encontrado.")

        # ✅ Extraer imagen como PNG
        if extract_image:
            if hasattr(ds, "PixelData"):
                try:
                    pixels = ds.pixel_array

                    # Normalizar a 8 bits si es necesario
                    if pixels.dtype != np.uint8:
                        pixels = (pixels - pixels.min()) / (pixels.max() - pixels.min())
                        pixels = (pixels * 255).astype(np.uint8)

                    # Convertir y guardar
                    imagen = Image.fromarray(pixels)
                    output_path = Path(self.base_path) / (path_to_file.stem + ".png")
                    imagen.save(output_path)
                    print(f"Imagen extraída y guardada como: {output_path}")
                except Exception as error:
                    self.log_error(f"No se pudo extraer la imagen del DICOM: {error}")
            else:
                self.log_error("El archivo DICOM no contiene datos de píxeles (PixelData).")

        return

    def log_error (self, message: str):
        time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        line = f"[{time}] ERROR: {message}\n"

        with open(self.logger, 'a', encoding='utf-8') as file:
            file.write(line)