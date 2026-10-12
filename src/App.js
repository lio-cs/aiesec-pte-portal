import React, { useState } from 'react';
import { Search, MapPin, Star, Calendar } from 'lucide-react';

const BLUE = "#003764";
const CYAN = "#03C2E2";

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'Global Volunteer',
    faculty: 'Faculty of Business and Economics',
    startDateStart: '2024-06-01',
    startDateEnd: '2024-08-31'
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: BLUE, color: 'white', padding: '20px', borderBottom: '5px solid ' + CYAN, textAlign: 'center' }}>
        <h1 style={{ margin: 0, letterSpacing: '-1px' }}>AIESEC <span style={{fontWeight: 300}}>Hungary x PTE</span></h1>
        <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>OFFICIAL OPPORTUNITY CATALOGUE</p>
      </header>

      <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
          <div>
            <label style={{ color: BLUE, fontWeight: 'bold', fontSize: '12px' }}>PTE FACULTY</label>
            <select style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} onChange={e => setForm({...form, faculty: e.target.value})}>
              <option>Faculty of Business and Economics</option>
              <option>Faculty of Engineering and IT</option>
              <option>Faculty of Humanities and Social Sciences</option>
              <option>Medical School</option>
              <option>Faculty of Law</option>
            </select>
          </div>
          <div>
            <label style={{ color: BLUE, fontWeight: 'bold', fontSize: '12px' }}>EARLIEST START</label>
            <input type="date" style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }} onChange={e => setForm({...form, startDateStart: e.target.value})} />
          </div>
          <button onClick={handleSearch} style={{ backgroundColor: CYAN, color: 'white', padding: '14px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Search size={18} /> {loading ? "LOADING..." : "SHOW OPPORTUNITIES"}
          </button>
        </div>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {results.map(opp => (
            <div key={opp.id} style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
              <div style={{ height: '160px', backgroundColor: '#eee', position: 'relative' }}>
                <img src={opp.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="opp" />
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
                  ★ {opp.score}% Match
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ color: CYAN, fontSize: '12px', fontWeight: 'bold' }}>{opp.country.toUpperCase()}</div>
                <h3 style={{ color: BLUE, margin: '5px 0 15px 0', height: '50px', overflow: 'hidden' }}>{opp.title}</h3>
                <a href={opp.url} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', padding: '12px', backgroundColor: BLUE, color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>VIEW CATALOGUE ITEM</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
