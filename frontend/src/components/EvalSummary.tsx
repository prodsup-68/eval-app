import { useUser } from 'src/hooks/user';

import { useAuth } from '../hooks/auth';

function EvalSummary() {
  const auth = useAuth();
  if (!auth.isAdmin) {
    return <div>Access Denied</div>;
  }
  const users = useUser();
  // console.log('users', users);
  return (
    <div>
      <div>สรุปการประเมิน</div>

      <div>จำนวนผู้ประเมินทั้งหมด: {users.info_all.count_total}</div>
      <div>
        จำนวนผู้ประเมินที่ประเมินหลักสูตร: {users.info_all.eval_course_count}
      </div>
      <div>จำนวนผู้ประเมินที่ประเมิน NR: {users.info_all.eval_nr_count}</div>
      <div>จำนวนผู้ประเมินที่ประเมิน AC: {users.info_all.eval_ac_count}</div>
      <div>จำนวนผู้ประเมินที่ประเมิน SR: {users.info_all.eval_sr_count}</div>

      <div className="tabs tabs-lift">
        <label className="tab">
          <input type="radio" name="score_tabs" defaultChecked />
          001
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="001" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          002
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="002" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          003
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="003" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          004
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="004" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          005
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="005" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          006
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="006" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" defaultChecked />
          801
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="801" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          802
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="802" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          803
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="803" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          804
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="804" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          805
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="805" data={users} />
        </div>

        <label className="tab">
          <input type="radio" name="score_tabs" />
          806
        </label>
        <div className="tab-content">
          <DisplayStudentList sec="806" data={users} />
        </div>
      </div>
    </div>
  );
}

interface DisplayStudentListProps {
  sec: string;
  data: ReturnType<typeof useUser>;
}

function DisplayStudentList({ sec, data }: DisplayStudentListProps) {
  const key = `info_${sec}` as keyof ReturnType<typeof useUser>;
  const secs = (data?.[key] ?? []) as unknown as any;

  console.log(secs);
  return (
    <div>
      <div>Section {sec}</div>
      <div>จำนวนผู้ประเมินทั้งหมด: {secs.count_total}</div>
      <div>จำนวนผู้ประเมินที่ประเมินหลักสูตร: {secs.eval_course_count}</div>
      <div>จำนวนผู้ประเมินที่ประเมิน NR: {secs.eval_nr_count}</div>
      <div>จำนวนผู้ประเมินที่ประเมิน AC: {secs.eval_ac_count}</div>
      <div>จำนวนผู้ประเมินที่ประเมิน SR: {secs.eval_sr_count}</div>
      <table>
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
          {secs.data.map((user: any, idx: number) => (
            <tr key={user.id}>
              <td>{idx + 1}</td>
              <td>{user.student_id}</td>
              <td>{user.name}</td>
              <td>{user.is_eval_course ? 'Yes' : 'No'}</td>
              <td>{user.is_eval_nr ? 'Yes' : 'No'}</td>
              <td>{user.is_eval_ac ? 'Yes' : 'No'}</td>
              <td>{user.is_eval_sr ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default EvalSummary;
