import { useMutation } from '@tanstack/react-query';

useMutation;
function Upload() {
  const mutationFn = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  };

  const { mutate } = useMutation({ mutationFn });

  return (
    <>
      <h1>Upload</h1>

      <input type="file" />
      <button
        onClick={() => {
          const fileInput = document.querySelector(
            'input[type="file"]',
          ) as HTMLInputElement;
          if (fileInput.files && fileInput.files.length > 0) {
            mutate(fileInput.files[0]);
          }
        }}
      >
        Upload
      </button>
    </>
  );
}

export default Upload;
