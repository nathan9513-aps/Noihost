import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🏠 NoiHost
          </span>
        </h1>
        <p className="text-2xl text-center mb-4 font-semibold">
          Cleaning Management Platform
        </p>
        <p className="text-lg text-center mb-12 text-muted-foreground">
          Connect property hosts with professional cleaners
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-3">🏠 For Hosts</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Auto-schedule cleanings</li>
              <li>✓ Calendar sync (Airbnb, Vrbo)</li>
              <li>✓ Find trusted cleaners</li>
              <li>✓ Auto-payments</li>
              <li>✓ Real-time updates</li>
            </ul>
          </div>
          
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-3">✨ For Cleaners</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Accept cleaning jobs</li>
              <li>✓ Get paid automatically</li>
              <li>✓ Photo checklists</li>
              <li>✓ Chat with hosts</li>
              <li>✓ Build your reputation</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-12">
          <Link href="/register?role=host">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
              Sign Up as Host
            </button>
          </Link>
          <Link href="/register?role=cleaner">
            <button className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-accent transition">
              Sign Up as Cleaner
            </button>
          </Link>
        </div>
        
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition">
            Already have an account? <span className="font-semibold">Sign In</span>
          </Link>
        </div>
        
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>⚙️ Project Status: <span className="text-green-600 font-semibold">Development Ready</span></p>
          <p className="mt-2">Backend API running on port 3001 • Frontend on port 3000</p>
        </div>
      </div>
    </main>
  );
}
