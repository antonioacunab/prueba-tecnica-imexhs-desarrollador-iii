from pathlib import Path
from file_processor import FileProcessor

base_path = str(Path(__file__).resolve().parent)

logs_path = Path(base_path) / "./logs.txt"

processor = FileProcessor(base_path, logs_path)

reports_path = Path(base_path) / "./report.txt"

processor.read_csv("./samples/sample-02-csv.csv", reports_path, True)