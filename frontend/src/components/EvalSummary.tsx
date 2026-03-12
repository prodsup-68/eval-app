import { useState } from 'react';
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
  const key = `info_${sec}` as keyof ReturnType<typeof useUser>;
  const sectionInfo = (data?.[key] ?? data.info_all) as UserSummary;

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
            {sectionInfo.data.map((user: any, idx: number) => (
              <tr key={user.id}>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EvalSummary;
