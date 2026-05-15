import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import AppBar from "../AppBar";

export default function XlsxViewerAdmin() {
  const { hash } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchXlsx = async () => {
      if (!hash) return;

      try {
        const response = await axios.get(`http://localhost:8000/xlsx/${hash}`, {
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
  }, [hash]);

  return (
    <div className="min-h-screen flex font-[Cormorant] flex-col bg-[#222] text-white">
      <AppBar />
      <div className="flex-grow flex flex-col items-center p-6">
        <div className="w-full max-w-10xl bg-[#222] shadow-lg rounded-[20px] overflow-hidden border border-white">
          {data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-3 border border-[#00000099] bg-[#222]">

                <thead className="bg-[#00000099] text-white">
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key} className="border border-white px-4 py-3 text-center rounded-[12px] w-40 h-12">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-[#00000066]" : "bg-[#00000066]"}>
                      {Object.values(row).map((value, colIndex) => (
                        <td className="border border-[#00000099] px-4 py-3 text-center text-sm rounded-lg w-[90px] h-[140px]">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ) : (
            <p className="text-center text-gray-400 py-10">Загрузка...</p>
          )}
        </div>
      </div>
    </div>
  );
}
