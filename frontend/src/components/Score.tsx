import { useAuth } from 'src/hooks/auth';
import { useScore } from 'src/hooks/score';

function Score() {
  const auth = useAuth();
  const scores = useScore();
  const is_allowed_to_view_score =
    auth?.data?.is_eval_course &&
    auth?.data?.is_eval_nr &&
    auth?.data?.is_eval_ac &&
    auth?.data?.is_eval_sr;

  if (!is_allowed_to_view_score) {
    return (
      <section className="mx-auto w-full max-w-3xl space-y-6">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">ยังไม่สามารถดูคะแนนรวมได้</h1>
              <p className="text-base-content/70">
                กรุณาประเมินรายวิชาและอาจารย์ทุกท่านให้ครบก่อนดูคะแนนรวม
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>หัวข้อ</th>
                    <th className="text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Class</td>
                    <td className="text-right">
                      <StatusBadge done={Boolean(auth.data?.is_eval_course)} />
                    </td>
                  </tr>
                  <tr>
                    <td>นิรันดร์</td>
                    <td className="text-right">
                      <StatusBadge done={Boolean(auth.data?.is_eval_nr)} />
                    </td>
                  </tr>
                  <tr>
                    <td>อนิรุท</td>
                    <td className="text-right">
                      <StatusBadge done={Boolean(auth.data?.is_eval_ac)} />
                    </td>
                  </tr>
                  <tr>
                    <td>ศักดิ์เกษม</td>
                    <td className="text-right">
                      <StatusBadge done={Boolean(auth.data?.is_eval_sr)} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card-actions justify-end">
              <a className="btn btn-primary" href="/upload">
                ไปหน้าอัปโหลดหลักฐานการประเมิน
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Score</h1>
        <p className="text-base-content/70">ดูรายละเอียดคะแนนแต่ละหัวข้อ</p>
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-0">
          <div className="tabs tabs-lift tabs-lg">
            <label className="tab px-6">
              <input type="radio" name="score_tabs" defaultChecked />
              คะแนนรวม
            </label>
            <div className="tab-content border-base-300 bg-base-100 p-6">
              ยังไม่มีคะแนนประกาศในตอนนี้
            </div>

            <label className="tab px-6">
              <input type="radio" name="score_tabs" />
              นิรันดร์
            </label>
            <div className="tab-content border-base-300 bg-base-100 p-6">
              <ScoreDisplayNR scores={scores} />
            </div>

            <label className="tab px-6">
              <input type="radio" name="score_tabs" />
              อนิรุท
            </label>
            <div className="tab-content border-base-300 bg-base-100 p-6">
              ยังไม่มีคะแนนประกาศในตอนนี้
            </div>

            <label className="tab px-6">
              <input type="radio" name="score_tabs" />
              ศักดิ์เกษม
            </label>
            <div className="tab-content border-base-300 bg-base-100 p-6">
              ยังไม่มีคะแนนประกาศในตอนนี้
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Score;

interface ScoreDisplayNrProps {
  scores: ReturnType<typeof useScore> | undefined;
}

function StatusBadge({ done }: { done: boolean }) {
  if (done) {
    return <span className="badge badge-success">ประเมินแล้ว</span>;
  }

  return <span className="badge badge-error">ยังไม่ประเมิน</span>;
}

function ScoreDisplayNR({ scores }: ScoreDisplayNrProps) {
  const data = scores?.data ?? null;
  if (!data) {
    return <div className="alert">ยังไม่มีคะแนน</div>;
  }

  const sc = data.scores['nr'];
  //   console.log('scores', sc);
  const formatValue = (value: unknown) => {
    if (value === null) {
      return '-';
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
      if (value === 0) {
        return '-';
      }
    }

    return String(value);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-box border border-base-300 bg-base-200 p-4">
        <h3 className="text-lg font-semibold">
          คะแนนโปรเจค {sc['group_id']} : {sc['topic']}
        </h3>
        <p className="text-xs text-base-content/70">
          {sc['name']} ({sc['student_id']})
        </p>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>รายการ</th>
              <th>คะแนน</th>
              <th>คะแนนเต็ม</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Proposal</td>
              <td>{formatValue(sc.proposal)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>ERPNext: Master Data</td>
              <td>{formatValue(sc.master_data)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>ERPNext: Purchase/Sale</td>
              <td>{formatValue(sc.purchase_sale)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>ERPNext: Manufacturing</td>
              <td>{formatValue(sc.manu)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>NodeRED: Monitor</td>
              <td>{formatValue(sc.monitor)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>NodeRED: Control</td>
              <td>{formatValue(sc.control)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>NodeRED: Notification</td>
              <td>{formatValue(sc.notification)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>NodeRED: Storage</td>
              <td>{formatValue(sc.storage)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>System Design</td>
              <td>{formatValue(sc.system_design)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Integration</td>
              <td>{formatValue(sc.integration)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Slide</td>
              <td>{formatValue(sc.slide)}</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Demo</td>
              <td>{formatValue(sc['demo (2)'])}</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Penalty</td>
              <td>{formatValue(sc['Penalty'])}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Penalty Note</td>
              <td>{formatValue(sc['Penalty Note'])}</td>
              <td>-</td>
            </tr>
            <tr className="font-semibold">
              <td>Total</td>
              <td>{formatValue(sc['total (35)'])}</td>
              <td>35</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
