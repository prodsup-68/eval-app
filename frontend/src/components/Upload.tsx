import { pb } from '@lib/db';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from 'src/hooks/auth';
import { useUpload } from 'src/hooks/upload';

useMutation;
function Upload() {
  const auth = useAuth();
  const uploads = useUpload();
  console.log('uploads', uploads);
  console.log('auth', auth);
  return (
    <>
      <h1>Upload</h1>
      <UploadDisplay task="course" uploads={uploads} auth={auth} />
      <UploadDisplay task="nr" uploads={uploads} auth={auth} />
      <UploadDisplay task="ac" uploads={uploads} auth={auth} />
      <UploadDisplay task="sr" uploads={uploads} auth={auth} />
    </>
  );
}

export default Upload;

interface UploadDisplayProps {
  task: string;
  uploads: ReturnType<typeof useUpload>;
  auth: ReturnType<typeof useAuth>;
}
function UploadDisplay({ task, uploads, auth }: UploadDisplayProps) {
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
  let is_eval = false;
  if (task === 'course') {
    title = 'Course Upload';
    is_eval = auth?.data?.is_eval_course ?? false;
    if (uploads.course_len > 0) {
      fileObj = uploads.course_arr[0];
    }
  } else if (task === 'nr') {
    title = 'NR Upload';
    is_eval = auth?.data?.is_eval_nr ?? false;
    if (uploads.nr_len > 0) {
      fileObj = uploads.nr_arr[0];
    }
  } else if (task === 'ac') {
    title = 'AC Upload';
    is_eval = auth?.data?.is_eval_ac ?? false;
    if (uploads.ac_len > 0) {
      fileObj = uploads.ac_arr[0];
    }
  } else if (task === 'sr') {
    title = 'SR Upload';
    is_eval = auth?.data?.is_eval_sr ?? false;
    if (uploads.sr_len > 0) {
      fileObj = uploads.sr_arr[0];
    }
  }

  return (
    <>
      <h3>
        {title} ({is_eval ? '✅' : '❌'})
      </h3>
      {fileObj && (
        <>
          <img src={fileObj.fileUrl} alt={title} />
          <p>คะแนนความถูกต้อง: {fileObj?.weighted_score ?? 0} %</p>
        </>
      )}
      {(!fileObj || !is_eval) && (
        <>
          <h3>No file uploaded for {task} yet.</h3>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={() => mutation.mutate(file as File)}>Upload</button>
        </>
      )}
    </>
  );
}
