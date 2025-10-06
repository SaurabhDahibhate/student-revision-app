import { X, Download } from "lucide-react";
import { useEffect } from "react";
import { getPDFFileUrl } from "../services/api";

export default function PDFViewer({ pdf, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "1200px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {pdf.name}
            </h2>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {pdf.pages} pages
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <a
              href={getPDFFileUrl(pdf.id)}
              download={pdf.name}
              style={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              title="Download PDF"
            >
              <Download
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  color: "#4b5563",
                }}
              />
            </a>
            <button
              onClick={onClose}
              style={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                border: "none",
                backgroundColor: "transparent",
                transition: "background-color 0.2s",
              }}
            >
              <X
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  color: "#4b5563",
                }}
              />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div
          style={{ flex: 1, backgroundColor: "#e5e7eb", overflow: "hidden" }}
        >
          <iframe
            src={`${getPDFFileUrl(pdf.id)}#toolbar=1&navpanes=1&scrollbar=1`}
            style={{ width: "100%", height: "100%", border: "none" }}
            title={pdf.name}
          />
        </div>

        {/* Footer Info */}
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          Use the built-in PDF controls to navigate • Press ESC to close
        </div>
      </div>
    </div>
  );
}
