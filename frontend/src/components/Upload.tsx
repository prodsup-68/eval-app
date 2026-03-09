import { pb } from '@lib/db';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useUpload } from 'src/hooks/upload';

useMutation;
function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const uploads = useUpload();

  console.log('uploads', uploads);

  const mutationFn = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('task', 'course');
    return pb.collection('uploads').create(formData);
  };

  // console.log('file', file);
  const mutation = useMutation({ mutationFn });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  return (
    <>
      <h1>Upload</h1>

      {uploads.course_len > 0 && (
        <div>
          <h2>Course Uploads</h2>
          <UploadDisplay
            fileUrl={uploads.course_arr[0].fileUrl}
            task="Course"
          />
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={() => mutation.mutate(file as File)}>Upload</button>
    </>
  );
}

export default Upload;

interface UploadDisplayProps {
  fileUrl: string;
  task: string;
}
function UploadDisplay({ fileUrl, task }: UploadDisplayProps) {
  return <img src={fileUrl} alt={`${task} Upload`} />;
}
