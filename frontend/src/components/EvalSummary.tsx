import { useRef, useState } from 'react';
import { useUpload } from 'src/hooks/upload';
import { useUser } from 'src/hooks/user';

import { useAuth } from '../hooks/auth';

const sections = [
  '001',
  '002',
  '003',
  '004',
  '005',
  '006',
  '801',
  '802',
  '803',
  '804',
  '805',
  '806',
];

type UserSummary = ReturnType<typeof useUser>['info_all'];

function EvalSummary() {
  const auth = useAuth();
  if (!auth.isAdmin) {
    return (
      <div className="p-4 md:p-6">
        <div className="alert alert-error">Access Denied</div>
      </div>
    );
  }

  const users = useUser();
  const [activeSec, setActiveSec] = useState(sections[0]);

  if (users.isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="skeleton h-8 w-56" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-24 w-full" />
        </div>
        <div className="skeleton h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">สรุปการประเมิน</h1>
        <div className="badge badge-primary badge-outline">Admin</div>
      </div>

      <div className="stats stats-vertical w-full shadow md:stats-horizontal">
        <div className="stat">
          <div className="stat-title">ผู้ประเมินทั้งหมด</div>
          <div className="stat-value text-primary">
            {users.info_all.count_total}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">ประเมินหลักสูตร</div>
          <div className="stat-value text-info">
            {users.info_all.eval_course_count}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">ประเมิน NR</div>
          <div className="stat-value text-success">
            {users.info_all.eval_nr_count}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">ประเมิน AC</div>
          <div className="stat-value text-warning">
            {users.info_all.eval_ac_count}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">ประเมิน SR</div>
          <div className="stat-value text-secondary">
            {users.info_all.eval_sr_count}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto pb-1">
          <div
            role="tablist"
            className="tabs tabs-lift tabs-lg w-max min-w-full flex-nowrap whitespace-nowrap"
          >
            {sections.map((sec) => (
              <button
                key={sec}
                type="button"
                role="tab"
                className={`tab shrink-0 ${activeSec === sec ? 'tab-active' : ''}`}
                onClick={() => setActiveSec(sec)}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-box border border-base-300 bg-base-100 p-4">
          <DisplayStudentList sec={activeSec} data={users} />
        </div>
      </div>
    </div>
  );
}

interface DisplayStudentListProps {
  sec: string;
  data: ReturnType<typeof useUser>;
}

function StatusBadge({ value }: { value: boolean }) {
  return (
    <span
      className={`badge badge-sm ${value ? 'badge-success' : 'badge-ghost'}`}
    >
      {value ? 'Yes' : 'No'}
    </span>
  );
}

function DisplayStudentList({ sec, data }: DisplayStudentListProps) {
  const previewModalRef = useRef<HTMLDialogElement>(null);
  const [userId, setUserId] = useState('');
  const key = `info_${sec}` as keyof ReturnType<typeof useUser>;
  const sectionInfo = (data?.[key] ?? data.info_all) as UserSummary;
  function openPreview() {
    previewModalRef.current?.showModal();
  }

  return (
    <div className="space-y-4">
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body gap-3">
          <h2 className="card-title">Section {sec}</h2>
          <div className="stats stats-vertical w-full md:stats-horizontal">
            <div className="stat px-4">
              <div className="stat-title">ผู้ประเมินทั้งหมด</div>
              <div className="stat-value text-lg">
                {sectionInfo.count_total}
              </div>
            </div>
            <div className="stat px-4">
              <div className="stat-title">หลักสูตร</div>
              <div className="stat-value text-lg">
                {sectionInfo.eval_course_count}
              </div>
            </div>
            <div className="stat px-4">
              <div className="stat-title">NR</div>
              <div className="stat-value text-lg">
                {sectionInfo.eval_nr_count}
              </div>
            </div>
            <div className="stat px-4">
              <div className="stat-title">AC</div>
              <div className="stat-value text-lg">
                {sectionInfo.eval_ac_count}
              </div>
            </div>
            <div className="stat px-4">
              <div className="stat-title">SR</div>
              <div className="stat-value text-lg">
                {sectionInfo.eval_sr_count}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>NR</th>
              <th>AC</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            {sectionInfo.data.map((user: any, idx: number) => {
              const showPreview =
                user.is_eval_course ||
                user.is_eval_nr ||
                user.is_eval_ac ||
                user.is_eval_sr;

              return (
                <tr
                  key={user.id}
                  onClick={() => {
                    showPreview && setUserId(user.id);
                    showPreview && openPreview();
                  }}
                  className={`${showPreview ? 'cursor-pointer' : ''}`}
                >
                  <td>{idx + 1}</td>
                  <td>{user.student_id}</td>
                  <td>{user.name}</td>
                  <td>
                    <StatusBadge value={user.is_eval_course} />
                  </td>
                  <td>
                    <StatusBadge value={user.is_eval_nr} />
                  </td>
                  <td>
                    <StatusBadge value={user.is_eval_ac} />
                  </td>
                  <td>
                    <StatusBadge value={user.is_eval_sr} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ImageModal userId={userId} modalRef={previewModalRef} />
    </div>
  );
}

export default EvalSummary;

interface ImageModalProps {
  userId: string;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}
function ImageModal({ userId, modalRef }: ImageModalProps) {
  const upload = useUpload(userId);
  // console.log('upload', upload);

  return (
    <>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-11/12 max-w-5xl p-2">
          <ImageDisplay
            imageUrl={upload.course_arr[0]?.fileUrl ?? null}
            title="Course"
          />
          <ImageDisplay
            imageUrl={upload.nr_arr[0]?.fileUrl ?? null}
            title="NR"
          />
          <ImageDisplay
            imageUrl={upload.ac_arr[0]?.fileUrl ?? null}
            title="AC"
          />
          <ImageDisplay
            imageUrl={upload.sr_arr[0]?.fileUrl ?? null}
            title="SR"
          />

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
    </>
  );
}

interface ImageDisplaylProps {
  imageUrl: string | null;
  title: string;
}
function ImageDisplay({ imageUrl, title }: ImageDisplaylProps) {
  return (
    <div>
      {imageUrl && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <img
            src={imageUrl}
            alt={`${title} preview`}
            className="max-h-[80vh] w-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
