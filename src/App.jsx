import { useEffect, useMemo, useState } from 'react';
import './App.css';

const initialStations = {
  Maitri: {
    location: 'Schirmacher Oasis', temp: -18, humidity: 72, wind: 18, pressure: 982,
    power: 310, battery: 91, energy: 82, personnel: 38, latency: 180,
    equipment: [
      { id: 'GEN-01', name: 'Diesel Generator 01', type: 'Power', health: 96, status: 'Operational', load: 74, temp: 64, voltage: 415, current: 42, vibration: 1.8, last: '18 Sep 2026', next: '18 Oct 2026' },
      { id: 'HVAC-01', name: 'Heating / HVAC', type: 'Thermal', health: 92, status: 'Operational', load: 68, temp: 41, voltage: 230, current: 18, vibration: 0.8, last: '21 Sep 2026', next: '21 Oct 2026' },
      { id: 'WTR-01', name: 'Water Treatment', type: 'Utility', health: 98, status: 'Operational', load: 51, temp: 19, voltage: 230, current: 9, vibration: 0.5, last: '10 Sep 2026', next: '10 Nov 2026' },
      { id: 'COM-01', name: 'Communication Link', type: 'Communication', health: 94, status: 'Operational', load: 42, temp: 28, voltage: 48, current: 6, vibration: 0.1, last: '25 Sep 2026', next: '25 Oct 2026' },
    ],
    inventory: [
      { name: 'Food Supplies', stock: 88, days: 54, status: 'Healthy' },
      { name: 'Fuel', stock: 76, days: 31, status: 'Monitor' },
      { name: 'Medicines', stock: 86, days: 48, status: 'Healthy' },
      { name: 'Oxygen', stock: 94, days: 63, status: 'Healthy' },
      { name: 'Spare Parts', stock: 68, days: 24, status: 'Monitor' },
    ],
    medical: { healthy: 35, attention: 2, emergency: 1, doctor: 'Available', medicines: 86, oxygen: 94 },
    maintenance: [
      { equipment: 'Diesel Generator 01', priority: 'Medium', due: '18 Oct 2026', status: 'Scheduled' },
      { equipment: 'Heating / HVAC', priority: 'High', due: '21 Oct 2026', status: 'Scheduled' },
      { equipment: 'Communication Link', priority: 'Low', due: '25 Oct 2026', status: 'Scheduled' },
    ],
  },
  Bharati: {
    location: 'Larsemann Hills', temp: -22, humidity: 68, wind: 22, pressure: 978,
    power: 280, battery: 87, energy: 76, personnel: 42, latency: 220,
    equipment: [
      { id: 'GEN-01', name: 'Diesel Generator 01', type: 'Power', health: 91, status: 'Operational', load: 70, temp: 67, voltage: 415, current: 39, vibration: 2.1, last: '15 Sep 2026', next: '15 Oct 2026' },
      { id: 'HVAC-01', name: 'Heating / HVAC', type: 'Thermal', health: 89, status: 'Attention', load: 76, temp: 45, voltage: 230, current: 21, vibration: 1.1, last: '17 Sep 2026', next: '10 Oct 2026' },
      { id: 'WTR-01', name: 'Water Treatment', type: 'Utility', health: 94, status: 'Operational', load: 48, temp: 18, voltage: 230, current: 8, vibration: 0.6, last: '09 Sep 2026', next: '09 Nov 2026' },
      { id: 'COM-01', name: 'Communication Link', type: 'Communication', health: 90, status: 'Operational', load: 49, temp: 30, voltage: 48, current: 7, vibration: 0.2, last: '23 Sep 2026', next: '23 Oct 2026' },
    ],
    inventory: [
      { name: 'Food Supplies', stock: 82, days: 49, status: 'Healthy' },
      { name: 'Fuel', stock: 69, days: 27, status: 'Monitor' },
      { name: 'Medicines', stock: 79, days: 41, status: 'Healthy' },
      { name: 'Oxygen', stock: 88, days: 56, status: 'Healthy' },
      { name: 'Spare Parts', stock: 61, days: 19, status: 'Low' },
    ],
    medical: { healthy: 39, attention: 2, emergency: 1, doctor: 'Available', medicines: 79, oxygen: 88 },
    maintenance: [
      { equipment: 'Heating / HVAC', priority: 'High', due: '10 Oct 2026', status: 'Attention' },
      { equipment: 'Diesel Generator 01', priority: 'Medium', due: '15 Oct 2026', status: 'Scheduled' },
      { equipment: 'Communication Link', priority: 'Low', due: '23 Oct 2026', status: 'Scheduled' },
    ],
  },
};

const nav = [
  ['dashboard', '⌂', 'Dashboard'], ['digital-twin', '◈', 'Digital Twin'], ['energy', '⚡', 'Energy'],
  ['environment', '☁', 'Environment'], ['infrastructure', '▣', 'Infrastructure'], ['logistics', '▤', 'Logistics'],
  ['personnel', '♟', 'Personnel'], ['communication', '⌁', 'Communication'], ['maintenance', '🔧', 'Maintenance'],
  ['medical', '✚', 'Medical'], ['alerts', '⚠', 'Alerts'], ['analytics', '◒', 'Analytics'],
];

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const jitter = (v, amount, min, max) => clamp(v + (Math.random() * amount * 2 - amount), min, max);

function App() {
  const [page, setPage] = useState('dashboard');
  const [station, setStation] = useState('Maitri');
  const [stations, setStations] = useState(initialStations);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setStations(prev => {
        const next = structuredClone(prev);
        Object.keys(next).forEach(name => {
          const s = next[name];
          s.temp = Math.round(jitter(s.temp, 1, -30, -10));
          s.humidity = Math.round(jitter(s.humidity, 2, 40, 95));
          s.wind = Math.round(jitter(s.wind, 2, 5, 50));
          s.pressure = Math.round(jitter(s.pressure, 2, 960, 1000));
          s.power = Math.round(jitter(s.power, 7, 220, 380));
          s.battery = Math.round(jitter(s.battery, 1, 60, 100));
          s.energy = Math.round(jitter(s.energy, 1, 50, 100));
          s.latency = Math.round(jitter(s.latency, 15, 100, 500));
          s.equipment = s.equipment.map(e => ({ ...e, health: Math.round(jitter(e.health, 0.6, 75, 100)), load: Math.round(jitter(e.load, 2, 20, 95)), temp: Math.round(jitter(e.temp, 1.5, 10, 85)), current: Math.round(jitter(e.current, 1, 2, 60)) }));
          s.medical.medicines = Math.round(jitter(s.medical.medicines, 0.5, 50, 100));
          s.medical.oxygen = Math.round(jitter(s.medical.oxygen, 0.4, 60, 100));
        });
        return next;
      });
      setLastUpdate(new Date());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const data = stations[station];
  
  const selectStation = name => {
    setStation(name);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brand-logo">❄</div><div><h2>POLAR-TWIN</h2><span>REMOTE STATION COMMAND</span></div></div>
        <div className="live-indicator"><span /> LIVE SIMULATION</div>
        <nav>{nav.map(([id, icon, label]) => <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}><span>{icon}</span>{label}</button>)}</nav>
        <div className="sidebar-bottom"><div className="connection"><span className="green-dot" /> System Online</div><div className="station-mini"><small>ACTIVE STATION</small><strong>{station}</strong></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><h1>{titleFor(page)}</h1><p>Maitri & Bharati • Remote Operations Management</p></div>
          <div className="topbar-right"><span className="live-badge">● LIVE</span><select value={station} onChange={e => selectStation(e.target.value)}><option>Maitri</option><option>Bharati</option></select></div>
        </header>

        {page === 'dashboard' && <Dashboard stations={stations} setPage={setPage} selectStation={selectStation} />}
        {page === 'digital-twin' && <DigitalTwin station={station} setStation={selectStation} data={data} />}
        {page === 'energy' && <Energy station={station} setStation={selectStation} data={data} stations={stations} />}
        {page === 'environment' && <Environment station={station} setStation={selectStation} data={data} />}
        {page === 'infrastructure' && <Infrastructure station={station} setStation={selectStation} data={data} setPage={setPage} />}
        {page === 'logistics' && <Logistics station={station} setStation={selectStation} data={data} />}
        {page === 'personnel' && <Personnel station={station} setStation={selectStation} data={data} />}
        {page === 'communication' && <Communication station={station} setStation={selectStation} data={data} />}
        {page === 'maintenance' && <Maintenance station={station} setStation={selectStation} data={data} />}
        {page === 'medical' && <Medical station={station} setStation={selectStation} data={data} />}
        {page === 'alerts' && <Alerts stations={stations} />}
        {page === 'analytics' && <Analytics stations={stations} />}

        <div className="footer-live">Last telemetry update: {lastUpdate.toLocaleTimeString()} • Simulated prototype data</div>
      </main>
    </div>
  );
}

function Dashboard({ stations, setPage, selectStation }) {
  return <div className="content">
    <div className="hero"><div><span className="eyebrow">ANTARCTIC REMOTE OPERATIONS</span><h2>Polar Twin Command Centre</h2><p>Centralized monitoring and remote operations for Maitri and Bharati.</p></div><button className="primary-button" onClick={() => setPage('digital-twin')}>OPEN DIGITAL TWIN →</button></div>
    <div className="station-grid">{['Maitri', 'Bharati'].map(name => { const s = stations[name]; return <button className="station-card" key={name} onClick={() => { selectStation(name); setPage('digital-twin'); }}><div className="station-header"><span className="station-status">● ONLINE</span><span>{name === 'Maitri' ? 'IND-01' : 'IND-02'}</span></div><h2>{name.toUpperCase()}</h2><p>{s.location}</p><div className="station-temp">{s.temp}°C</div><div className="station-data"><span>⚡ {s.power} kW</span><span>💨 {s.wind} km/h</span><span>👥 {s.personnel}</span></div></button>; })}</div>
    <div className="metric-grid"><Metric icon="⚡" title="Combined Power" value={`${stations.Maitri.power + stations.Bharati.power} kW`} sub="Both stations" onClick={() => setPage('energy')} /><Metric icon="❄" title="Coldest Station" value={`${Math.min(stations.Maitri.temp, stations.Bharati.temp)}°C`} sub="Live temperature" onClick={() => setPage('environment')} /><Metric icon="📡" title="Communication" value="ONLINE" sub={`${stations.Maitri.latency}/${stations.Bharati.latency} ms`} onClick={() => setPage('communication')} /><Metric icon="🚨" title="Attention Items" value="04" sub="Across modules" onClick={() => setPage('alerts')} /></div>
    <section className="panel"><div className="panel-header"><div><h2>Operational Snapshot</h2><p>Current station health</p></div></div><div className="snapshot-grid">{['Maitri','Bharati'].map(name => { const s=stations[name]; return <div className="snapshot" key={name}><div className="snapshot-head"><strong>{name}</strong><span className="status-good">● ONLINE</span></div><Progress label="Equipment health" value={Math.round(s.equipment.reduce((a,e)=>a+e.health,0)/s.equipment.length)} /><Progress label="Battery" value={s.battery} /><Progress label="Energy reserve" value={s.energy} /></div>})}</div></section>
  </div>;
}

function DigitalTwin({ station, setStation, data }) {
  const [selectedEquipment, setSelectedEquipment] = useState('GEN-01');
  const equipment = Array.isArray(data?.equipment) ? data.equipment : [];

  useEffect(() => {
    if (!equipment.some((item) => item.id === selectedEquipment)) {
      setSelectedEquipment(equipment[0]?.id || 'GEN-01');
    }
  }, [station, equipment, selectedEquipment]);

  const current =
    equipment.find((item) => item.id === selectedEquipment) ||
    equipment[0];

  const selectEquipment = (id) => setSelectedEquipment(id);

  if (!data || equipment.length === 0) {
    return (
      <Page
        title="Digital Twin"
        subtitle="Interactive virtual representation of the selected Antarctic station"
      >
        <StationSelector station={station} setStation={setStation} />
        <section className="panel">
          <div className="empty-state">
            <h2>Digital Twin data is loading…</h2>
            <p>Please wait for the station telemetry to initialize.</p>
          </div>
        </section>
      </Page>
    );
  }

  return (
    <Page
      title="Digital Twin"
      subtitle="Interactive virtual representation of the selected Antarctic station"
    >
      <StationSelector station={station} setStation={setStation} />

      <div className="selected-station">
        <span>ACTIVE STATION</span>
        <strong>{station.toUpperCase()}</strong>
        <small>{data.location} • Live simulated telemetry</small>
      </div>

      <div className="metric-grid">
        <Metric icon="🌡" title="Temperature" value={`${data.temp}°C`} sub="Live" />
        <Metric icon="⚡" title="Power" value={`${data.power} kW`} sub="Live" />
        <Metric
          icon="🏗"
          title="Equipment Health"
          value={`${Math.round(equipment.reduce((sum, item) => sum + Number(item.health || 0), 0) / equipment.length)}%`}
          sub="Fleet average"
        />
        <Metric icon="👥" title="Personnel" value={data.personnel} sub="On station" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{station} Digital Twin</h2>
            <p>Select a system on the station model to inspect it</p>
          </div>
          <span className="live-badge">● LIVE</span>
        </div>

        <div className="dt-layout">
          <div className="dt-model">
            <div className="dt-grid"></div>

            <div className="dt-building">
              <div className="dt-roof">ANTARCTIC RESEARCH STATION</div>
              <div className="dt-window one"></div>
              <div className="dt-window two"></div>
              <div className="dt-window three"></div>
              <div className="dt-window four"></div>
              <div className="dt-door"></div>
            </div>

            {equipment.map((item, index) => (
              <button
                key={item.id}
                className={`dt-node node-${index} ${
                  current?.id === item.id ? "selected" : ""
                }`}
                onClick={() => selectEquipment(item.id)}
              >
                <span>
                  {item.type === "Power" && "⚡"}
                  {item.type === "Thermal" && "🔥"}
                  {item.type === "Utility" && "💧"}
                  {item.type === "Communication" && "📡"}
                </span>
                <strong>{item.id}</strong>
                <small>{item.type}</small>
                <b>{item.health}%</b>
              </button>
            ))}

            <div className="dt-legend">
              <span><i></i> Operational</span>
              <span><i></i> Live telemetry</span>
            </div>
          </div>

          {current && (
            <div className="dt-details">
              <div className="dt-detail-head">
                <div>
                  <span>SELECTED SYSTEM</span>
                  <h2>{current.name}</h2>
                  <p>{current.id} • {current.type}</p>
                </div>
                <strong className={current.status === "Attention" ? "status-warn" : "status-good"}>
                  ● {current.status}
                </strong>
              </div>

              <div className="dt-reading-grid">
                <Detail label="Health" value={`${current.health}%`} />
                <Detail label="Load" value={`${current.load}%`} />
                <Detail label="Temperature" value={`${current.temp}°C`} />
                <Detail label="Voltage" value={`${current.voltage} V`} />
                <Detail label="Current" value={`${current.current} A`} />
                <Detail label="Vibration" value={`${current.vibration} mm/s`} />
              </div>

              <div className="dt-health">
                <div>
                  <span>Equipment health</span>
                  <b>{current.health}%</b>
                </div>
                <Progress value={current.health} />
              </div>

              <div className="dt-service">
                <div>
                  <span>Last maintenance</span>
                  <strong>{current.last}</strong>
                </div>
                <div>
                  <span>Next maintenance</span>
                  <strong>{current.next}</strong>
                </div>
              </div>

              <div className="dt-actions">
                <button
                  className="primary-button"
                  onClick={() => alert(`${current.name} diagnostic started for ${station}.`)}
                >
                  RUN DIAGNOSTIC
                </button>
                <button
                  className="secondary-button"
                  onClick={() => alert(`Maintenance history: ${current.name}`)}
                >
                  VIEW HISTORY
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Station Systems</h2>
            <p>Click any row to inspect detailed telemetry</p>
          </div>
        </div>

        <div className="dt-table">
          <div className="dt-table-head">
            <span>System</span>
            <span>Health</span>
            <span>Load</span>
            <span>Temperature</span>
            <span>Status</span>
          </div>

          {equipment.map((item) => (
            <button
              key={item.id}
              className={`dt-table-row ${current?.id === item.id ? "active" : ""}`}
              onClick={() => selectEquipment(item.id)}
            >
              <span>
                <strong>{item.name}</strong>
                <small>{item.id}</small>
              </span>
              <span>{item.health}%</span>
              <span>{item.load}%</span>
              <span>{item.temp}°C</span>
              <span className={item.status === "Attention" ? "status-warn" : "status-good"}>
                ● {item.status}
              </span>
            </button>
          ))}
        </div>
      </section>
    </Page>
  );
}

function EquipmentDetail({ equipment }) { return <div className="detail-card"><div className="detail-title"><div><span className="eyebrow">SELECTED EQUIPMENT</span><h2>{equipment.name}</h2><p>{equipment.id} • {equipment.type}</p></div><span className={equipment.status==='Attention'?'status-warn':'status-good'}>● {equipment.status}</span></div><div className="detail-grid"><Detail label="Health" value={`${equipment.health}%`} /><Detail label="Load" value={`${equipment.load}%`} /><Detail label="Temperature" value={`${equipment.temp}°C`} /><Detail label="Voltage" value={`${equipment.voltage} V`} /><Detail label="Current" value={`${equipment.current} A`} /><Detail label="Vibration" value={`${equipment.vibration} mm/s`} /></div><div className="service-box"><div><span>Last maintenance</span><strong>{equipment.last}</strong></div><div><span>Next maintenance</span><strong>{equipment.next}</strong></div></div><div className="button-row"><button className="primary-button">VIEW SENSOR HISTORY</button><button className="secondary-button">CREATE MAINTENANCE REQUEST</button></div></div>; }

function Energy({ station, setStation, data, stations }) {
  const base = station === 'Maitri'
    ? [286, 294, 310, 325, 318, 305]
    : [260, 268, 280, 292, 286, 274];
  const chart = base.map((power, i) => ({ label: ['00', '04', '08', '12', '16', '20'][i], power }))
    .concat([{ label: 'NOW', power: data.power }]);

  const generatorOutput = Math.round(data.power * 0.74);
  const renewable = station === 'Maitri' ? 12 : 9;
  const dailyUsage = (data.power * 24 / 1000).toFixed(1);
  const peakLoad = Math.max(...chart.map(x => x.power));
  const reserveMargin = Math.max(0, 100 - Math.round(data.energy));
  const efficiency = Math.round(88 + data.energy / 10);
  const highLoad = data.power > 320;

  const equipmentPower = data.equipment.map((item) => ({
    ...item,
    power: Math.max(8, Math.round(data.power * item.load / 100 * 0.18)),
  }));

  return (
    <Page title="Energy & Power" subtitle="Detailed power generation, consumption and reserve monitoring">
      <StationSelector station={station} setStation={setStation} />

      <div className="metric-grid">
        <Metric icon="⚡" title="Current Load" value={`${data.power} kW`} sub={station} />
        <Metric icon="🔋" title="Battery" value={`${data.battery}%`} sub="Available reserve" />
        <Metric icon="☀" title="Renewable Share" value={`${renewable}%`} sub="Estimated contribution" />
        <Metric icon="🎯" title="Peak Load" value={`${peakLoad} kW`} sub="Today" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div><h2>{station} Power Trend</h2><p>Simulated 24-hour station load profile</p></div>
          <span className="live-badge">● LIVE</span>
        </div>
        <BarChart data={chart} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div><h2>Generation & Reserve</h2><p>Current electrical system condition</p></div>
          <span className={highLoad ? 'status-warn' : 'status-good'}>● {highLoad ? 'HIGH LOAD' : 'NORMAL'}</span>
        </div>
        <div className="detail-grid four">
          <Detail label="Generator output" value={`${generatorOutput} kW`} />
          <Detail label="Daily usage" value={`${dailyUsage} MWh`} />
          <Detail label="Reserve margin" value={`${reserveMargin}%`} />
          <Detail label="System efficiency" value={`${efficiency}%`} />
        </div>
        <div className="snapshot-grid">
          <div className="snapshot">
            <div className="snapshot-head"><strong>Battery reserve</strong><span>{data.battery}%</span></div>
            <Progress label="Available capacity" value={data.battery} />
          </div>
          <div className="snapshot">
            <div className="snapshot-head"><strong>Renewable contribution</strong><span>{renewable}%</span></div>
            <Progress label="Solar / renewable share" value={renewable} />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div><h2>Equipment-wise Consumption</h2><p>Estimated contribution to current station load</p></div>
        </div>
        <div className="equipment-table">
          {equipmentPower.map((item) => (
            <div className="table-row" key={item.id}>
              <span><b>{item.name}</b><small>{item.id} • {item.type}</small></span>
              <span>{item.load}% load</span>
              <span>{item.power} kW</span>
              <span className={item.load >= 75 ? 'status-warn' : 'status-good'}>● {item.load >= 75 ? 'HIGH' : 'NORMAL'}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header"><div><h2>Station Energy Comparison</h2><p>Live current load across both stations</p></div></div>
        <ComparisonBar name="Maitri" value={stations.Maitri.power} max={400} />
        <ComparisonBar name="Bharati" value={stations.Bharati.power} max={400} />
      </section>

      <section className="panel">
        <div className="panel-header"><div><h2>Energy Alerts</h2><p>Threshold-based operational assessment</p></div></div>
        <div className="table-row">
          <span><b>{station} load condition</b><small>Current consumption vs operational threshold</small></span>
          <span>{data.power} kW</span>
          <span>{highLoad ? 'Above 320 kW' : 'Within normal range'}</span>
          <span className={highLoad ? 'status-warn' : 'status-good'}>● {highLoad ? 'WARNING' : 'NORMAL'}</span>
        </div>
        <div className="table-row">
          <span><b>Battery reserve</b><small>Backup power availability</small></span>
          <span>{data.battery}%</span>
          <span>Minimum target: 60%</span>
          <span className={data.battery < 60 ? 'status-warn' : 'status-good'}>● {data.battery < 60 ? 'LOW' : 'HEALTHY'}</span>
        </div>
      </section>
    </Page>
  );
}

function Environment({ station, setStation, data }) { const sensors=[['Air Temperature',`${data.temp}°C`,'Threshold: -30 to -10°C','Normal'],['Humidity',`${data.humidity}%`,'Threshold: 40 to 90%','Normal'],['Wind Speed',`${data.wind} km/h`,'Advisory above 35 km/h',data.wind>35?'Attention':'Normal'],['Pressure',`${data.pressure} hPa`,'Live atmospheric pressure','Normal']]; return <Page title="Environment Monitoring" subtitle="Multi-sensor environmental conditions and threshold monitoring"><StationSelector station={station} setStation={setStation}/><div className="sensor-grid">{sensors.map(([name,value,threshold,status])=><div className="sensor-card" key={name}><div><span>{name}</span><strong>{value}</strong></div><em className={status==='Attention'?'status-warn':'status-good'}>● {status}</em><small>{threshold}</small></div>)}</div><section className="panel"><div className="panel-header"><h2>Environmental Trend</h2><span className="live-badge">● LIVE</span></div><MiniTrend base={Math.abs(data.temp)} unit="°C" /></section><section className="panel"><div className="panel-header"><h2>Sensor Diagnostics</h2><p>Monitoring health</p></div><div className="equipment-table">{['Temperature sensor','Humidity sensor','Wind sensor','Pressure sensor','Snow / ice monitor'].map((x,i)=><div className="table-row" key={x}><span><b>{x}</b><small>SENSOR-0{i+1}</small></span><span>Sampling 3s</span><span>Signal {92-i*2}%</span><span className="status-good">● ONLINE</span></div>)}</div></section></Page>; }

function Infrastructure({ station, setStation, data, setPage }) {
  const [selectedId, setSelectedId] = useState(data.equipment[0]?.id || '');
  const selected = data.equipment.find(e => e.id === selectedId) || data.equipment[0];

  useEffect(() => {
    if (!data.equipment.some(e => e.id === selectedId)) {
      setSelectedId(data.equipment[0]?.id || '');
    }
  }, [data.equipment, selectedId]);

  const averageHealth = Math.round(
    data.equipment.reduce((sum, e) => sum + e.health, 0) / data.equipment.length
  );

  return (
    <Page title="Infrastructure" subtitle="Equipment-level infrastructure health and operational status">
      <StationSelector station={station} setStation={setStation} />

      <div className="metric-grid">
        <Metric icon="🏗" title="Fleet Health" value={`${averageHealth}%`} sub={station} />
        <Metric icon="⚙" title="Operational" value={`${data.equipment.filter(e => e.status === 'Operational').length}/${data.equipment.length}`} sub="Equipment" />
        <Metric icon="⚠" title="Attention" value={data.equipment.filter(e => e.status === 'Attention').length} sub="Needs review" />
        <Metric icon="🔧" title="Next Service" value="10–21 Oct" sub="Upcoming" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Station Infrastructure</h2>
            <p>Select equipment to inspect live telemetry and maintenance information.</p>
          </div>
          <span className="status-good">● {station} ONLINE</span>
        </div>

        <div className="equipment-cards">
          {data.equipment.map(e => (
            <button
              type="button"
              className="equipment-card"
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                border: selected?.id === e.id ? '1px solid rgba(91, 189, 255, .9)' : undefined,
                boxShadow: selected?.id === e.id ? '0 0 0 1px rgba(91, 189, 255, .18), 0 12px 30px rgba(0,0,0,.16)' : undefined
              }}
            >
              <div className="card-top">
                <div>
                  <span className="eyebrow">{e.id}</span>
                  <h3>{e.name}</h3>
                </div>
                <span className={e.status === 'Attention' ? 'status-warn' : 'status-good'}>● {e.status}</span>
              </div>
              <div className="health-number">{e.health}%</div>
              <Progress label="Health" value={e.health} />
              <div className="mini-stats">
                <span>Load <b>{e.load}%</b></span>
                <span>Temp <b>{e.temp}°C</b></span>
                <span>Current <b>{e.current} A</b></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">SELECTED EQUIPMENT · {selected.id}</span>
              <h2>{selected.name}</h2>
              <p>{selected.type} system at {station} station</p>
            </div>
            <span className={selected.status === 'Attention' ? 'status-warn' : 'status-good'}>
              ● {selected.status}
            </span>
          </div>

          <div className="metric-grid">
            <Metric icon="❤️" title="Equipment Health" value={`${selected.health}%`} sub="Current condition" />
            <Metric icon="⚡" title="Load" value={`${selected.load}%`} sub="Operating load" />
            <Metric icon="🌡" title="Temperature" value={`${selected.temp}°C`} sub="Live sensor" />
            <Metric icon="〽" title="Vibration" value={`${selected.vibration} mm/s`} sub="Condition monitoring" />
          </div>

          <div className="detail-grid">
            <div className="detail-card">
              <span className="eyebrow">ELECTRICAL</span>
              <h3>Power telemetry</h3>
              <div className="detail-row"><span>Voltage</span><strong>{selected.voltage} V</strong></div>
              <div className="detail-row"><span>Current</span><strong>{selected.current} A</strong></div>
              <div className="detail-row"><span>Load</span><strong>{selected.load}%</strong></div>
            </div>

            <div className="detail-card">
              <span className="eyebrow">MAINTENANCE</span>
              <h3>Service information</h3>
              <div className="detail-row"><span>Last service</span><strong>{selected.last}</strong></div>
              <div className="detail-row"><span>Next service</span><strong>{selected.next}</strong></div>
              <div className="detail-row"><span>Condition</span><strong>{selected.status}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <button className="primary-button" onClick={() => setPage('digital-twin')}>OPEN IN DIGITAL TWIN →</button>
            <button className="secondary-button" onClick={() => setPage('maintenance')}>VIEW MAINTENANCE →</button>
          </div>
        </section>
      )}
    </Page>
  );
}
function Logistics({ station, setStation, data }) { return <Page title="Logistics & Inventory" subtitle="Supplies, consumption rates and resupply readiness"><StationSelector station={station} setStation={setStation}/><div className="metric-grid"><Metric icon="📦" title="Inventory Health" value={`${Math.round(data.inventory.reduce((a,x)=>a+x.stock,0)/data.inventory.length)}%`} sub="Average stock"/><Metric icon="⛽" title="Fuel" value={`${data.inventory[1].stock}%`} sub={`${data.inventory[1].days} days remaining`}/><Metric icon="💊" title="Medicines" value={`${data.inventory[2].stock}%`} sub={`${data.inventory[2].days} days remaining`}/><Metric icon="🚚" title="Next Resupply" value="12 days" sub="Estimated"/></div><section className="panel"><div className="panel-header"><h2>{station} Inventory</h2><p>Live stock readiness</p></div><div className="inventory-detail">{data.inventory.map(item=><div className="inventory-item" key={item.name}><div className="inventory-head"><span><b>{item.name}</b><small>{item.days} days remaining</small></span><strong>{item.stock}%</strong></div><Progress label="" value={item.stock}/><div className="inventory-foot"><span className={item.status==='Low'?'status-warn':item.status==='Monitor'?'status-info':'status-good'}>● {item.status}</span><span>Consumption monitored</span></div></div>)}</div></section></Page>; }

function Personnel({ station, setStation, data }) { return <Page title="Personnel" subtitle="Station personnel status, availability and safety overview"><StationSelector station={station} setStation={setStation}/><div className="metric-grid"><Metric icon="👥" title="Total Personnel" value={data.personnel} sub={station}/><Metric icon="💚" title="Healthy" value={data.medical.healthy} sub="Personnel"/><Metric icon="⚠" title="Attention" value={data.medical.attention} sub="Medical monitoring"/><Metric icon="🚨" title="Emergency" value={data.medical.emergency} sub="Immediate attention"/></div><section className="panel"><div className="panel-header"><h2>Personnel Overview</h2><span className="status-good">● ALL ACCOUNTED</span></div><div className="personnel-grid"><PersonnelGroup name="Research Team" count={Math.round(data.personnel*.34)} /><PersonnelGroup name="Engineering" count={Math.round(data.personnel*.24)} /><PersonnelGroup name="Operations" count={Math.round(data.personnel*.21)} /><PersonnelGroup name="Support" count={data.personnel-Math.round(data.personnel*.34)-Math.round(data.personnel*.24)-Math.round(data.personnel*.21)} /></div></section><section className="panel"><div className="panel-header"><h2>Safety Status</h2><p>Linked to Medical module</p></div><div className="safety-row"><span>Personnel tracking</span><b className="status-good">ONLINE</b></div><div className="safety-row"><span>Emergency communication</span><b className="status-good">READY</b></div><div className="safety-row"><span>Medical response</span><b className="status-good">AVAILABLE</b></div></section></Page>; }

function Communication({ station, setStation, data }) { return <Page title="Communication" subtitle="Primary and backup communication links"><StationSelector station={station} setStation={setStation}/><div className="metric-grid"><Metric icon="📡" title="Primary Link" value="ONLINE" sub={`${data.latency} ms latency`}/><Metric icon="🛰" title="Backup Link" value="READY" sub="Standby"/><Metric icon="📶" title="Signal" value="94%" sub="Current strength"/><Metric icon="◌" title="Packet Loss" value="0.8%" sub="Last sample"/></div><section className="panel"><div className="panel-header"><h2>Communication Diagnostics</h2></div><div className="communication-grid"><Comm name="Primary satellite" status="ONLINE" value={`${data.latency} ms`} /><Comm name="Backup satellite" status="STANDBY" value="320 ms" /><Comm name="Station LAN" status="ONLINE" value="4 ms" /><Comm name="Telemetry gateway" status="ONLINE" value="1.2 s" /></div></section><section className="panel"><div className="panel-header"><h2>Transmission History</h2><p>Recent telemetry windows</p></div><div className="equipment-table">{['09:42:15','09:42:12','09:42:09','09:42:06'].map((t,i)=><div className="table-row" key={t}><span><b>Telemetry packet</b><small>{t}</small></span><span>128 bytes</span><span>{data.latency+i*4} ms</span><span className="status-good">● Delivered</span></div>)}</div></section></Page>; }

function Maintenance({ station, setStation, data }) { return <Page title="Maintenance" subtitle="Preventive maintenance, service schedules and equipment health"><StationSelector station={station} setStation={setStation}/><div className="metric-grid"><Metric icon="🔧" title="Scheduled" value={data.maintenance.length} sub="Upcoming"/><Metric icon="⚠" title="High Priority" value={data.maintenance.filter(x=>x.priority==='High').length} sub="Needs attention"/><Metric icon="✓" title="Completed" value="18" sub="This month"/><Metric icon="📈" title="Predicted" value="02" sub="Potential issues"/></div><section className="panel"><div className="panel-header"><h2>Maintenance Schedule</h2><button className="secondary-button">+ NEW REQUEST</button></div><div className="equipment-table">{data.maintenance.map(x=><div className="table-row" key={x.equipment}><span><b>{x.equipment}</b><small>Service due {x.due}</small></span><span className={x.priority==='High'?'status-warn':'status-info'}>{x.priority}</span><span>{x.status}</span><button className="tiny-button">VIEW</button></div>)}</div></section><section className="panel"><div className="panel-header"><h2>Predictive Maintenance</h2><p>Simulated analytics</p></div><div className="prediction"><div><span>Heating / HVAC</span><strong>Service recommended within 7 days</strong></div><b className="status-warn">HIGH</b></div><div className="prediction"><div><span>Generator vibration</span><strong>Within normal range</strong></div><b className="status-good">NORMAL</b></div></section></Page>; }

function Medical({ station, setStation, data }) { const [request,setRequest]=useState(false); return <Page title="Medical Assistance" subtitle="Remote healthcare support and emergency response"><StationSelector station={station} setStation={setStation}/><div className="medical-emergency"><div><span>🚨 EMERGENCY MEDICAL ASSISTANCE</span><h2>Need immediate medical help?</h2><p>Send an SOS to the remote medical team with station and personnel context.</p></div><button className="sos-button" onClick={()=>{setRequest(true);alert(`Emergency request sent from ${station}.`)}}>🚨 SEND SOS</button></div><div className="metric-grid"><Metric icon="💚" title="Healthy" value={data.medical.healthy} sub="Personnel"/><Metric icon="⚠" title="Attention" value={data.medical.attention} sub="Monitoring"/><Metric icon="🚨" title="Emergency" value={data.medical.emergency} sub="Critical"/><Metric icon="👨‍⚕️" title="Remote Doctor" value={data.medical.doctor} sub="Consultation"/></div><section className="panel"><div className="panel-header"><div><h2>Medical Request</h2><p>Create a consultation or emergency request</p></div><span className="status-good">● SERVICE ONLINE</span></div><div className="medical-form"><label>Personnel<select><option>Station Member #01</option><option>Station Member #12</option><option>Station Member #24</option><option>Station Member #31</option></select></label><label>Issue<select><option>General check-up</option><option>Injury</option><option>Breathing difficulty</option><option>Cold exposure</option><option>Fever / infection</option></select></label><label>Priority<select><option>Normal</option><option>High</option><option>Critical</option></select></label><label>Details<textarea placeholder="Describe the medical issue..." /></label></div><button className="primary-button" onClick={()=>setRequest(true)}>🏥 REQUEST MEDICAL ASSISTANCE</button></section><div className="medical-grid"><section className="panel"><div className="panel-header"><h2>👨‍⚕️ Remote Doctor</h2><span className="status-good">● AVAILABLE</span></div><p className="medical-text">Remote medical personnel can receive station requests and communicate with the selected station team.</p><button className="primary-button">📞 START CONSULTATION</button></section><section className="panel"><div className="panel-header"><h2>💊 Medical Inventory</h2></div><InventoryRow name="Medicines" value={data.medical.medicines}/><InventoryRow name="Oxygen" value={data.medical.oxygen}/><InventoryRow name="First Aid" value={92}/></section></div>{request&&<section className="panel medical-request"><div><span className="status-good">● REQUEST SENT</span><h2>Medical team notified</h2><p>Station: {station} • Communication: ONLINE</p></div><strong>Priority: CRITICAL</strong></section>}</Page>; }

function Alerts({ stations }) { return <Page title="Alerts & Events" subtitle="Sensor-driven alerts, thresholds and recommended actions"><div className="metric-grid"><Metric icon="🚨" title="Critical" value="01" sub="Immediate attention"/><Metric icon="⚠" title="Warnings" value="03" sub="Monitoring"/><Metric icon="ℹ" title="Info" value="06" sub="System events"/><Metric icon="✓" title="Resolved" value="18" sub="Today"/></div><section className="panel"><div className="panel-header"><h2>Active Alerts</h2><p>Current station events</p></div><AlertDetail type="CRITICAL" station="Maitri" module="Medical" value="1 emergency case" threshold="Immediate response" action="Open Medical Assistance and notify remote doctor."/><AlertDetail type="WARNING" station="Bharati" module="Environment" value={`${stations.Bharati.wind} km/h wind`} threshold="35 km/h advisory" action="Monitor weather and review station access conditions."/><AlertDetail type="WARNING" station="Bharati" module="Maintenance" value="HVAC health 89%" threshold="90% review threshold" action="Schedule HVAC inspection."/><AlertDetail type="INFO" station="Maitri" module="Energy" value={`${stations.Maitri.power} kW`} threshold="Normal operating range" action="Continue monitoring load profile."/></section></Page>; }

function Analytics({ stations }) { const m=stations.Maitri,b=stations.Bharati; return <Page title="Analytics & Intelligence" subtitle="Operational trends, station comparison and predictive insights"><div className="metric-grid"><Metric icon="⚡" title="Combined Load" value={`${m.power+b.power} kW`} sub="Live"/><Metric icon="🏗" title="Maitri Health" value={`${Math.round(m.equipment.reduce((a,e)=>a+e.health,0)/m.equipment.length)}%`} sub="Equipment"/><Metric icon="🏗" title="Bharati Health" value={`${Math.round(b.equipment.reduce((a,e)=>a+e.health,0)/b.equipment.length)}%`} sub="Equipment"/><Metric icon="🤖" title="Anomalies" value="02" sub="Simulated detection"/></div><section className="panel"><div className="panel-header"><h2>Station Performance</h2><p>Live comparison</p></div><ComparisonBar name="Maitri Power" value={m.power} max={400}/><ComparisonBar name="Bharati Power" value={b.power} max={400}/><ComparisonBar name="Maitri Equipment" value={Math.round(m.equipment.reduce((a,e)=>a+e.health,0)/m.equipment.length)} max={100}/><ComparisonBar name="Bharati Equipment" value={Math.round(b.equipment.reduce((a,e)=>a+e.health,0)/b.equipment.length)} max={100}/></section><section className="panel"><div className="panel-header"><h2>AI-style Operational Insights</h2><span className="live-badge">SIMULATED</span></div><div className="insight-grid"><Insight title="Energy" text="Power demand is within the expected operating band for both stations."/><Insight title="Maintenance" text="Bharati HVAC is the highest-priority equipment item in the current simulation."/><Insight title="Logistics" text="Bharati spare parts have the lowest stock reserve and should be reviewed for resupply."/><Insight title="Safety" text="Medical response is available and communication links are operational."/></div></section></Page>; }

function Page({title,subtitle,children}) { return <div className="content"><div className="page-heading"><h2>{title}</h2><p>{subtitle}</p></div>{children}</div>; }
function StationSelector({station,setStation}) { return <div className="station-selector"><span>STATION</span><button className={station==='Maitri'?'selected':''} onClick={()=>setStation('Maitri')}>❄ MAITRI</button><button className={station==='Bharati'?'selected':''} onClick={()=>setStation('Bharati')}>❄ BHARATI</button></div>; }
function Metric({icon,title,value,sub,onClick}) { return <button className="metric-card" disabled={!onClick} onClick={onClick}><div className="metric-icon">{icon}</div><div><span>{title}</span><strong>{value}</strong><small>{sub}</small></div></button>; }
function Detail({label,value}) { return <div className="detail-item"><span>{label}</span><strong>{value}</strong></div>; }
function Progress({label,value}) { return <div className="progress-wrap">{label&&<div className="progress-label"><span>{label}</span><b>{value}%</b></div>}<div className="progress"><div style={{width:`${clamp(value,0,100)}%`}} /></div></div>; }
function ComparisonBar({name,value,max}) { return <div className="comparison-row"><div className="comparison-title"><span>{name}</span><strong>{value}{name.includes('Equipment')?'%':' kW'}</strong></div><div className="comparison-track"><div className="comparison-fill" style={{width:`${clamp(value/max*100,0,100)}%`}} /></div></div>; }
function BarChart({data}) { const max=Math.max(...data.map(x=>x.power)); const min=Math.min(...data.map(x=>x.power))-30; return <div className="energy-chart">{data.map(x=><div className="chart-column" key={x.label}><div className="chart-value">{x.power}</div><div className="chart-bar-wrapper"><div className="chart-bar" style={{height:`${clamp((x.power-min)/(max-min)*100,15,100)}%`}} /></div><span>{x.label}</span></div>)}</div>; }
function MiniTrend({base,unit}) { const values=[base-3,base-2,base-1,base,base+1,base-1,base]; return <div className="mini-trend">{values.map((v,i)=><div className="trend-point" key={i}><span>{v}{unit}</span><div style={{height:`${30+(v-base+4)*13}px`}} /></div>)}</div>; }
function InventoryRow({name,value}) { return <div className="inventory-row"><span>{name}</span><strong>{value}%</strong><div className="mini-progress"><div style={{width:`${value}%`}} /></div></div>; }
function PersonnelGroup({name,count}) { return <div className="person-group"><span>{name}</span><strong>{count}</strong><small>Assigned personnel</small></div>; }
function Comm({name,status,value}) { return <div className="comm-card"><span>{name}</span><strong className={status==='ONLINE'?'status-good':'status-info'}>● {status}</strong><b>{value}</b></div>; }
function AlertDetail({type,station,module,value,threshold,action}) { return <div className="alert-detail"><div className={`alert-type ${type.toLowerCase()}`}>{type}</div><div className="alert-main"><div className="alert-head"><strong>{module}</strong><span>{station}</span></div><div className="alert-values"><span>Observed: <b>{value}</b></span><span>Threshold: <b>{threshold}</b></span></div><p>Recommended action: {action}</p></div><button className="tiny-button">ACKNOWLEDGE</button></div>; }
function Insight({title,text}) { return <div className="insight"><span>◆ {title}</span><p>{text}</p></div>; }
function titleFor(page) { return nav.find(x=>x[0]===page)?.[2] || 'Polar Twin'; }

export default App;
