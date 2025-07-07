from pathlib import Path
from file_processor import FileProcessor

base_path = str(Path(__file__).resolve().parent)

logs_path = Path(base_path) / "./logs.txt"

processor = FileProcessor(base_path, logs_path)

processor.read_dicom("./samples/sample-02-dicom-2.dcm", [], True)