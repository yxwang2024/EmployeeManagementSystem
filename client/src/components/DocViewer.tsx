import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "@cyntler/react-doc-viewer/dist/index.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

/**
 *
 * @param url  url of the document to be previewed
 * @returns  DocViewer component
 */
const DocViewerComponent: React.FC<{
  url: string;
  type: string;
  title: string;
}> = ({ url, type, title }) => {
  const [openPreview, setOpenPreview] = useState(false);

  return (
    <div className="flex flex-row justify-between items-center">
      <Button
        variant="contained"
        color="primary"
        sx={{ display: { xs: "none", md: "block" }, alignItems: "center", justifyContent: "center" }}
        onClick={() => setOpenPreview(true)}
      >
        Preview
      </Button>
      <IconButton
        onClick={() => setOpenPreview(true)}
        sx={{ display: { xs: "block", md: "none" }, alignItems: "center", justifyContent: "center" }}
      >
        <VisibilityIcon />
      </IconButton>
      <IconButton
        onClick={() => window.open(url, "_blank")}
        sx={{ display: 'block' }}
      >
        <DownloadIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        closeAfterTransition
        // slots={{ backdrop: Backdrop}}
        // slotProps={{
        //   backdrop: {
        //     timeout: 500,
        //   },
        // }}
      >
        <Fade in={openPreview}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div className="flex flex-col justify-start items-start h-full w-full md:w-3/4 md:h-5/6 bg-white rounded-lg shadow-lg p-4">
              <div className="flex flex-row justify-between w-full items-center">
                <Typography variant="h4">Preview</Typography>
                <Typography variant="subtitle1">{title}</Typography>
                <IconButton onClick={() => setOpenPreview(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="w-full h-full overflow-auto">
                <DocViewer
                  documents={[
                    {
                      uri: url,
                      fileType: type,
                    },
                  ]}
                  config={{
                    header: {
                      disableHeader: true,
                    },
                  }}
                  pluginRenderers={DocViewerRenderers}
                />
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default DocViewerComponent;
