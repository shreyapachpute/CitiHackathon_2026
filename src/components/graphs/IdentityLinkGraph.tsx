import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { IdentityLink, LinkTypeKey } from '../../types';
import { IDENTITY_LINK_CONFIGS } from '../../data/seedData';
import {
  Share2,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const IdentityLinkGraph: React.FC = () => {
  const {
    identityLinks,
    graphNodes,
    activeScenario,
    setActiveScenario,
    selectedIdentityNodeId,
    setSelectedIdentityNodeId
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterType, setFilterType] = useState<'ALL' | LinkTypeKey>('ALL');

  // Build adjacency graph of accounts and identity values
  const { adj, allAccounts, allIdentities, accountScores } = useMemo(() => {
    const adjMap: Record<string, string[]> = {};
    const accs = new Set<string>();
    const ids = new Set<string>();
    const scores: Record<string, number> = {};

    graphNodes.forEach(n => {
      scores[n.id] = n.riskScore;
    });

    identityLinks.forEach(link => {
      const identityKey = `${link.type}:${link.value}`;
      accs.add(link.account);
      ids.add(identityKey);

      if (!adjMap[link.account]) adjMap[link.account] = [];
      if (!adjMap[identityKey]) adjMap[identityKey] = [];

      adjMap[link.account].push(identityKey);
      adjMap[identityKey].push(link.account);
    });

    return {
      adj: adjMap,
      allAccounts: Array.from(accs),
      allIdentities: Array.from(ids),
      accountScores: scores
    };
  }, [identityLinks, graphNodes]);

  // Compute node positions using deterministic circular/spring layout
  const { positions, edges } = useMemo(() => {
    const W = 960;
    const H = 640;
    const pos: Record<string, { x: number; y: number; isAccount: boolean; type?: LinkTypeKey; label: string }> = {};
    const edgeList: { from: string; to: string; type: LinkTypeKey }[] = [];

    // Filter by type if selected
    const activeLinks = identityLinks.filter(l => filterType === 'ALL' || l.type === filterType);

    // Place central ring hub if Rohan Verma
    const centerAcc = 'ACC-9081-2246';
    pos[centerAcc] = { x: W / 2, y: H / 2, isAccount: true, label: centerAcc };

    // Place identities around in orbit
    const identityList = Array.from(new Set(activeLinks.map(l => `${l.type}:${l.value}`)));
    const totalIds = identityList.length;

    identityList.forEach((idKey, idx) => {
      const angle = (idx / Math.max(1, totalIds)) * Math.PI * 2;
      const radius = 180 + (idx % 3) * 35;
      const [typeKey, ...valParts] = idKey.split(':');
      const val = valParts.join(':');

      pos[idKey] = {
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius * 0.85,
        isAccount: false,
        type: typeKey as LinkTypeKey,
        label: val
      };
    });

    // Place remaining accounts outer orbit
    const remainingAccs = Array.from(new Set(activeLinks.map(l => l.account))).filter(a => a !== centerAcc);
    const totalAccs = remainingAccs.length;

    remainingAccs.forEach((acc, idx) => {
      const angle = (idx / Math.max(1, totalAccs)) * Math.PI * 2 + 0.2;
      const radius = 310 + (idx % 2) * 45;

      pos[acc] = {
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius * 0.85,
        isAccount: true,
        label: acc
      };
    });

    activeLinks.forEach(l => {
      const idKey = `${l.type}:${l.value}`;
      if (pos[l.account] && pos[idKey]) {
        edgeList.push({ from: l.account, to: idKey, type: l.type });
      }
    });

    return { positions: pos, edges: edgeList };
  }, [identityLinks, filterType]);

  // Neighbors of currently selected node
  const activeNeighbors = useMemo(() => {
    if (!selectedIdentityNodeId) return null;
    const set = new Set<string>([selectedIdentityNodeId]);
    (adj[selectedIdentityNodeId] || []).forEach(n => set.add(n));
    return set;
  }, [selectedIdentityNodeId, adj]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[820px]">
      
      {/* Header Bar (Blue Gradient) */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-4 border-b border-blue-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600/30 border border-purple-500/40 rounded-xl text-purple-300">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">Graph 2: Identity Link Network & Fraud Ring Cluster</h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Entity Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Detects hidden fraud syndicates sharing addresses, mobile numbers, PAN/Aadhaar IDs, and device fingerprints.
            </p>
          </div>
        </div>

        {/* Scenarios Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Scenarios:</span>
          {(
            [
              { id: 'ONE_CRORE', label: 'Rohan Verma 26+ Ring' },
              { id: 'SMURFING_RING', label: 'Karan Malhotra Hidden Link' },
              { id: 'TELEGRAM_SCAM', label: 'Apex Wealth Syndicate' },
              { id: 'CLEAN_PAYMENT', label: 'Priya Nair (0 Links)' }
            ] as const
          ).map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeScenario === sc.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
            title="Reset View"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter by Identity Attribute Ribbon & Legend */}
      <div className="bg-slate-850 px-6 py-2.5 border-b border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px]">Filter Entity Type:</span>
          {(['ALL', 'add', 'hom', 'ssn', 'bus'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                filterType === t
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All Links' : IDENTITY_LINK_CONFIGS[t].label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-300">Account</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="text-slate-300">Address</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            <span className="text-slate-300">Phone</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="text-slate-300">PAN / Aadhaar</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span className="text-slate-300">Business Phone</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 relative flex overflow-hidden bg-slate-950">
        <div className="flex-1 h-full overflow-auto relative p-4">
          <svg
            className="w-full h-full min-w-[960px] min-h-[640px]"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.15s ease' }}
          >
            <defs>
              <filter id="red-ring-glow">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            {/* Suspected Mule Ring Cluster Outline */}
            <g>
              <circle
                cx={positions['ACC-9081-2246']?.x || 480}
                cy={positions['ACC-9081-2246']?.y || 320}
                r="240"
                fill="#e11d48"
                fillOpacity="0.04"
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
              <text
                x={positions['ACC-9081-2246']?.x || 480}
                y={(positions['ACC-9081-2246']?.y || 320) - 246}
                textAnchor="middle"
                fill="#f43f5e"
                className="text-[10px] font-mono font-bold uppercase tracking-wider"
              >
                Suspected Multi-Identity Fraud Ring Cluster (Simulated)
              </text>
            </g>

            {/* Edges */}
            <g>
              {edges.map((e, idx) => {
                const p1 = positions[e.from];
                const p2 = positions[e.to];
                if (!p1 || !p2) return null;

                const isDimmed = activeNeighbors && (!activeNeighbors.has(e.from) || !activeNeighbors.has(e.to));
                const config = IDENTITY_LINK_CONFIGS[e.type];

                return (
                  <line
                    key={idx}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={config?.stroke || '#64748b'}
                    strokeWidth={isDimmed ? 1 : 1.6}
                    strokeOpacity={isDimmed ? 0.12 : 0.75}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {Object.entries(positions).map(([nodeKey, p]) => {
                const isSelected = selectedIdentityNodeId === nodeKey;
                const isDimmed = activeNeighbors && !activeNeighbors.has(nodeKey);
                const isAccount = p.isAccount;
                const score = accountScores[nodeKey] ?? 50;
                const isFlaggedAccount = isAccount && score >= 70;

                const nodeColor = isAccount
                  ? isFlaggedAccount
                    ? '#e11d48'
                    : '#10b981'
                  : p.type
                  ? IDENTITY_LINK_CONFIGS[p.type].color
                  : '#94a3b8';

                return (
                  <g
                    key={nodeKey}
                    transform={`translate(${p.x}, ${p.y})`}
                    onClick={() => setSelectedIdentityNodeId(isSelected ? null : nodeKey)}
                    className="cursor-pointer group"
                    opacity={isDimmed ? 0.2 : 1}
                  >
                    {/* Red glow for flagged account */}
                    {isFlaggedAccount && (
                      <circle
                        r="24"
                        fill="#e11d48"
                        opacity="0.35"
                        filter="url(#red-ring-glow)"
                      />
                    )}

                    {/* Selected ring */}
                    {isSelected && (
                      <circle
                        r="22"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      r={isAccount ? 16 : 11}
                      fill={nodeColor}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-transform group-hover:scale-110"
                    />

                    {/* Text label */}
                    <text
                      y={isAccount ? 28 : 22}
                      textAnchor="middle"
                      fill="#f8fafc"
                      className="text-[9px] font-mono font-medium pointer-events-none"
                    >
                      {isAccount ? `#${nodeKey.slice(-4)}` : p.label.slice(0, 16)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Bottom Info Pill */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-2">
            <Info className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>
              {selectedIdentityNodeId
                ? `Node ${selectedIdentityNodeId} selected — connected to ${adj[selectedIdentityNodeId]?.length || 0} entities.`
                : 'Click any node to isolate its connected accounts and shared identity credentials.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
