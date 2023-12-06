import React, { useState } from "react";
import { fireDB } from "./firebase";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx"; // Import thư viện xlsx
import { writeBatch, collection, doc } from "firebase/firestore";

const UploadExcel = () => {
  const [excelData, setExcelData] = useState([]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Sử dụng thư viện XLSX để đọc tệp Excel
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Lấy dữ liệu từ tệp Excel (sử dụng sheet đầu tiên)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const dataJson = XLSX.utils.sheet_to_json(worksheet);

      // Lưu dữ liệu vào state excelData
      setExcelData(dataJson);

      // Lưu dữ liệu vào fireDB
      const batch = writeBatch(fireDB);
      const usersCollection = collection(fireDB, "users");

      dataJson.forEach((user) => {
        const newUserRef = doc(usersCollection); // Tạo một tài liệu mới với ID tự động
        batch.set(newUserRef, user);
      });

      batch.commit().then(() => {
        console.log("Dữ liệu đã được lưu vào fireDB.");
      });
    };

    reader.readAsBinaryString(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px" }}>
        <input {...getInputProps()} />
        <p>Kéo và thả tệp Excel vào đây hoặc nhấp để chọn tệp</p>
      </div>
      {excelData.length > 0 && (
        <div>
          <h2>Dữ liệu từ tệp Excel:</h2>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadExcel;


// Chúng ta sử dụng thư viện xlsx để đọc dữ liệu từ tệp Excel. Thư viện này cho phép chúng ta phân tích tệp Excel và chuyển đổi nó thành dữ liệu JSON.

// Khi người dùng tải lên tệp Excel, chúng ta sử dụng FileReader để đọc nội dung của tệp và sau đó sử dụng XLSX.read để đọc tệp Excel.

// Sau khi chúng ta có dữ liệu từ tệp Excel dưới dạng JSON (dataJson), chúng ta lưu dữ liệu này vào fireDB bằng cách sử dụng batch write để thêm nhiều tài liệu cùng một lúc.

// Cuối cùng, chúng ta hiển thị dữ liệu từ tệp Excel lên giao diện (nếu có).