import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function XlsxViewer({ room }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchXlsx = async () => {
      if (!room) return;

      try {
        const response = await axios.get(`http://localhost:8000/schedule/${room}`, {
          responseType: "arraybuffer",
        });

        const workbook = XLSX.read(new Uint8Array(response.data), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });

        setData(jsonData);
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
      }
    };

    fetchXlsx();
  }, [room]);

  return (
    <div className="max-h-[720px] overflow-y-auto">
      {data.length > 0 ? (
        <table className="w-full border border-white text-white border-separate border-spacing-2 rounded-[12px]">
        <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="border border-white px-4 py-3 text-center rounded-[12px] w-40 h-12">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-[#00000066]" : "bg-[#00000066]" }>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex} className="border border-[#00000099] px-4 py-3 text-center text-sm rounded-lg w-[90px] h-[140px]">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 text-center">У данной команты отсуствует расписание</p>
      )}
    </div>
  );
}
