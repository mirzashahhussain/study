import React, { useContext, useState, useEffect } from "react";
import { CourseContext } from "../context/CourseContext";
import "./style/certificates.css";

const CertificateDisplay = ({ userId2 }) => {
  const { fetchCertificates } = useContext(CourseContext);
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const userId = "64bf9fe7876e6ff974c685fe";

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const certificatesData = await fetchCertificates(userId);
        setCertificates(certificatesData);
        setLoadingCertificates(false);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setLoadingCertificates(false);
      }
    };

    fetchCertificateData();
  }, [userId]);

  if (loadingCertificates) {
    return <p>Loading certificates...</p>;
  }

  return (
    <div className="certificate-container">
      {certificates.map((certificate, index) => (
        <>
          <img
            key={index}
            src={certificate}
            alt={`Certificate ${index}`}
            className="certificate-image"
          />
          <a key={index} href={certificate} target="_blank" download>
            download
          </a>
        </>
      ))}
    </div>
  );
};

export default CertificateDisplay;
