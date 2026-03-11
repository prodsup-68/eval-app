import { useState } from 'react';

function Instruction() {
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">ตัวอย่างหลักฐานการประเมิน</h1>
        <p className="text-base-content/70">
          กรุณาอัปโหลดหลักฐานให้ครบตามตัวอย่างด้านล่าง
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title text-xl">การประเมินวิชา</h2>
              <p className="text-sm text-base-content/70">
                ตัวอย่างหลักฐานการประเมินรายวิชา
                (เห็นรหัสวิชาและคำว่าประเมินแล้วอย่างชัดเจน)
              </p>
            </div>
            <figure className="overflow-hidden rounded-box border border-base-300">
              <button
                type="button"
                className="block w-full cursor-zoom-in"
                onClick={() =>
                  setPreviewImage({
                    src: '/ex_course.jpg',
                    alt: 'ตัวอย่างการประเมินวิชา',
                  })
                }
              >
                <img
                  src="/ex_course.jpg"
                  alt="ตัวอย่างการประเมินวิชา"
                  className="w-full"
                />
              </button>
            </figure>
          </div>
        </article>

        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title text-xl">การประเมินอาจารย์</h2>
              <p className="text-sm text-base-content/70">
                เช่น หลักฐานการประเมินอาจารย์นิรันดร์
                (เห็นชื่ออาจารย์และคำว่าประเมินแล้วอย่างชัดเจน)
              </p>
            </div>
            <figure className="overflow-hidden rounded-box border border-base-300">
              <button
                type="button"
                className="block w-full cursor-zoom-in"
                onClick={() =>
                  setPreviewImage({
                    src: '/ex_nr.png',
                    alt: 'ตัวอย่างการประเมินอาจารย์',
                  })
                }
              >
                <img
                  src="/ex_nr.png"
                  alt="ตัวอย่างการประเมินอาจารย์"
                  className="w-full"
                />
              </button>
            </figure>
          </div>
        </article>
      </div>

      <dialog className={`modal ${previewImage ? 'modal-open' : ''}`}>
        <div className="modal-box max-h-[90vh] w-11/12 max-w-6xl bg-base-100 p-3">
          {previewImage && (
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              className="max-h-[82vh] w-full rounded-box object-contain"
            />
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => setPreviewImage(null)}>
            close
          </button>
        </form>
      </dialog>
    </section>
  );
}

export default Instruction;
