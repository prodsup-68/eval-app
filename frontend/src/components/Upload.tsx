import { pb } from '@lib/db';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useUpload } from 'src/hooks/upload';

useMutation;
function Upload() {
  const uploads = useUpload();
  // console.log('uploads', uploads);
  return (
    <>
      <h1>Upload</h1>
      <UploadDisplay task="course" uploads={uploads} />
      <UploadDisplay task="nr" uploads={uploads} />
      <UploadDisplay task="ac" uploads={uploads} />
      <UploadDisplay task="sr" uploads={uploads} />
    </>
  );
}

export default Upload;

interface UploadDisplayProps {
  task: string;
  uploads: ReturnType<typeof useUpload>;
}
function UploadDisplay({ task, uploads }: UploadDisplayProps) {
  const mutationFn = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('task', task);
    return pb.collection('uploads').create(formData);
  };

  const [file, setFile] = useState<File | null>(null);
  const mutation = useMutation({ mutationFn });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  let fileObj = null;
  let title = '';
  if (task === 'course' && uploads.course_len > 0) {
    fileObj = uploads.course_arr[0];
    title = 'Course Upload';
  } else if (task === 'nr' && uploads.nr_len > 0) {
    fileObj = uploads.nr_arr[0];
    title = 'NR Upload';
  } else if (task === 'ac' && uploads.ac_len > 0) {
    fileObj = uploads.ac_arr[0];
    title = 'AC Upload';
  } else if (task === 'sr' && uploads.sr_len > 0) {
    fileObj = uploads.sr_arr[0];
    title = 'SR Upload';
  }

  return (
    <>
      <h3>{title}</h3>
      {fileObj && (
        <>
          <img src={fileObj.fileUrl} alt={title} />
          <p>Weighted Score: {fileObj?.weighted_score ?? 0}</p>
        </>
      )}
      {!fileObj && (
        <>
          <h3>No file uploaded for {task} yet.</h3>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={() => mutation.mutate(file as File)}>Upload</button>
        </>
      )}
    </>
  );
}
