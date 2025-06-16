import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useTranslation } from "react-i18next";

interface Submission {
  id: string;
  [key: string]: any;
}

const SubmissionsPage = () => {
  const [data, setData] = useState<Submission[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await apiClient.get("/forms/submissions");
        setData(res.data.data);
        setColumns(res.data.columns);
        setSelectedColumns(res.data.columns);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    fetchSubmissions();
  }, []);

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]));
  };

  const filtered = data.filter((item) =>
    selectedColumns.some((col) => String(item[col]).toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])))
    : filtered;

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t("submitted_apps")}</h1>

      <input
        type="text"
        placeholder={`${t("search")}...`}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      <div className="mb-4">
        <strong className="text-gray-900 dark:text-gray-100">{t("columns")}:</strong>
        <div className="flex flex-wrap mt-2 gap-4">
          {columns.map((col) => (
            <label
              key={col}
              className="inline-flex items-center space-x-2 cursor-pointer select-none dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => handleColumnToggle(col)}
                className="form-checkbox h-5 w-5 text-indigo-600 dark:bg-gray-700"
              />
              <span>{col}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {selectedColumns.map((col) => (
                <th
                  key={col}
                  onClick={() => setSortKey(col)}
                  className="cursor-pointer px-4 py-2 border-b border-gray-300 text-left select-none hover:bg-gray-200 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  {col} {sortKey === col && "⬇"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                {selectedColumns.map((col) => (
                  <td key={col} className="px-4 py-2 border-b border-gray-300 dark:border-gray-600 dark:text-gray-200">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={selectedColumns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  {t("no_data")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 ${
            page === 1
              ? "text-gray-400 cursor-not-allowed dark:text-gray-600"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Prev
        </button>
        <span className="font-medium text-gray-900 dark:text-gray-200">
          Page {page} of {Math.ceil(sorted.length / pageSize)}
        </span>
        <button
          onClick={() => setPage((p) => (p * pageSize < sorted.length ? p + 1 : p))}
          disabled={page * pageSize >= sorted.length}
          className={`px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 ${
            page * pageSize >= sorted.length
              ? "text-gray-400 cursor-not-allowed dark:text-gray-600"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SubmissionsPage;
