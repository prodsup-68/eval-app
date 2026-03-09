function App() {
  return (
    <section
      className="hero min-h-[70vh] rounded-box"
      style={{
        backgroundImage: 'url(https://picsum.photos/1600/900?blur=1)',
      }}
    >
      <div className="hero-overlay rounded-box bg-black/55" />
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold md:text-5xl">EVALUATION & SCORE</h1>
          <p className="py-5 text-base md:text-lg">
            Application for uploading evaluations and viewing score
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="/upload" className="btn btn-primary">
              Start Upload
            </a>
            <a href="/score" className="btn btn-outline btn-neutral-content">
              Go to Score
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
