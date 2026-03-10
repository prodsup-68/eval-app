import { useAuth } from 'src/hooks/auth';

function Score() {
  const auth = useAuth();

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Score</h1>
        <p className="text-base-content/70 mt-1">
          ตรวจสอบคะแนนแต่ละส่วนผ่านแท็บด้านล่าง
        </p>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-0">
          <div className="tabs tabs-lift">
            <label className="tab px-6">
              <input type="radio" name="score_tabs" defaultChecked />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 me-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
              คะแนนรวม
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <ScoreDisplay auth={auth} task="course" />
            </div>

            <label className="tab px-6">
              <input type="radio" name="score_tabs" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 me-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
              นิรันดร์
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <ScoreDisplay auth={auth} task="nr" />
            </div>

            <label className="tab px-6">
              <input type="radio" name="score_tabs" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 me-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              อนิรุท
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <ScoreDisplay auth={auth} task="ac" />
            </div>

            <label className="tab px-6">
              <input type="radio" name="score_tabs" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 me-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 3.75h9m-9 0A1.5 1.5 0 0 0 6 5.25v13.5A1.5 1.5 0 0 0 7.5 20.25h9a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-9 0h9m-6 4.5h3m-3 3h3m-6.75 3h6.75"
                />
              </svg>
              ศักดิ์เกษม
            </label>
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <ScoreDisplay auth={auth} task="sr" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Score;

interface ScoreDisplayProps {
  auth: ReturnType<typeof useAuth>;
  task: string;
}
function ScoreDisplay({ task, auth }: ScoreDisplayProps) {
  if (task === 'course') {
    if (
      !auth?.data?.is_eval_course ||
      !auth?.data?.is_eval_nr ||
      !auth?.data?.is_eval_ac ||
      !auth?.data?.is_eval_sr
    ) {
      return <p>กรุณาประเมินรายวิชาและอาจารย์ทุกท่านก่อนดูคะแนนรวม</p>;
    }
  } else if (task === 'nr') {
    if (!auth?.data?.is_eval_nr) {
      return (
        <p>กรุณาประเมินอาจารย์ นิรันดร์ พิสุทธอานนท์ ก่อนดูคะแนนในส่วนนี้</p>
      );
    }
  } else if (task === 'ac') {
    if (!auth?.data?.is_eval_ac) {
      return <p>กรุณาประเมินอาจารย์ อนิรุท ไชยจารุวณิช ก่อนดูคะแนนในส่วนนี้</p>;
    }
  } else if (task === 'sr') {
    if (!auth?.data?.is_eval_sr) {
      return (
        <p>กรุณาประเมินอาจารย์ ศักดิ์เกษม ระมิงค์วงศ์ ก่อนดูคะแนนในส่วนนี้</p>
      );
    }
  }
  return (
    <>
      <p className="text-2xl font-bold">{task}</p>
    </>
  );
}
