import { pb } from '@lib/db';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useAuth } from 'src/hooks/auth';
import { useUpload } from 'src/hooks/upload';

function Upload() {
  const auth = useAuth();
  const uploads = useUpload();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload</h1>
        <p className="mt-1 text-sm text-base-content/70">
          Submit evaluation images for each task.
        </p>
      </div>

      {uploads.isLoading && (
        <div className="flex items-center gap-2 text-base-content/70">
          <span className="loading loading-spinner loading-sm" />
          <span>Loading uploads...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UploadDisplay task="course" uploads={uploads} auth={auth} />
        <UploadDisplay task="nr" uploads={uploads} auth={auth} />
        <UploadDisplay task="ac" uploads={uploads} auth={auth} />
        <UploadDisplay task="sr" uploads={uploads} auth={auth} />
      </div>
    </section>
  );
}

export default Upload;

interface UploadDisplayProps {
  task: string;
  uploads: ReturnType<typeof useUpload>;
  auth: ReturnType<typeof useAuth>;
}
function UploadDisplay({ task, uploads, auth }: UploadDisplayProps) {
  const previewModalRef = useRef<HTMLDialogElement | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const mutationFn = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('task', task);
    return pb.collection('uploads').create(formData);
  };

  const [file, setFile] = useState<File | null>(null);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      // Get the new is_eval value.
      auth.refetch();
      uploads.refetch();
      setFile(null);
    },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  function handleUpload() {
    if (!file || mutation.isPending) {
      return;
    }
    mutation.mutate(file);
  }

  function openPreview(url: string) {
    setPreviewImageUrl(url);
    previewModalRef.current?.showModal();
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
    <div className="card border border-base-300 bg-base-100 shadow-sm transition-colors duration-300 hover:bg-base-200/80">
      <div className="card-body gap-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title text-lg">{title}</h3>
          <span
            className={`badge ${is_eval ? 'badge-success' : 'badge-error'} badge-outline`}
          >
            {is_eval ? 'Evaluated' : 'Not evaluated'}
          </span>
        </div>

        {fileObj ? (
          <div className="space-y-3">
            <figure className="overflow-hidden rounded-lg border border-base-300">
              <img
                src={fileObj.fileUrl}
                alt={title}
                className="h-48 w-full object-cover transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                onClick={() => openPreview(fileObj.fileUrl)}
              />
            </figure>
            <div className="text-sm text-base-content/80">
              คะแนนความถูกต้อง:{' '}
              <span className="font-semibold">
                {fileObj?.weighted_score.toFixed(2) ?? 0}%
              </span>
              {!is_eval ? (
                <span className="text-error text-sm">
                  {' '}
                  (ความถูกต้องน้อยเกินไปกรุณาอัปโหลดไฟล์ใหม่)
                </span>
              ) : (
                <span className="text-success text-sm">
                  {' '}
                  (ความถูกต้องเพียงพอ)
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-base-content/70">กรุณาอัปโหลดไฟล์</p>
        )}

        {(!fileObj || !is_eval) && (
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />

            {mutation.isError && (
              <div className="alert alert-error py-2 text-sm">
                <span>Upload failed. Please try again.</span>
              </div>
            )}

            <div className="card-actions justify-end">
              <button
                className={`btn btn-primary ${mutation.isPending ? 'btn-disabled' : ''}`}
                onClick={handleUpload}
                disabled={!file || mutation.isPending}
              >
                {mutation.isPending ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        )}
      </div>
      <ImageModal
        modalRef={previewModalRef}
        imageUrl={previewImageUrl}
        title={title}
      />
    </div>
  );
}

interface ImageModalProps {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  imageUrl: string | null;
  title: string;
}

function ImageModal({ modalRef, imageUrl, title }: ImageModalProps) {
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-11/12 max-w-5xl p-2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${title} preview`}
            className="max-h-[80vh] w-full object-contain rounded-lg"
          />
        )}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
