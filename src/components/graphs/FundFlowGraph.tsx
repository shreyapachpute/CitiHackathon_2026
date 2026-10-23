import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FundFlowNode, FundFlowEdge, ScenarioId } from '../../types';
import { formatINR, formatINRCompact, getRiskBadgeClasses } from '../../utils/formatters';
import {
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Filter,
  ShieldAlert,
  Lock,
  ArrowRight,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

interface FundFlowGraphProps {
  onOpenFreezeModalForNode?: (node: FundFlowNode) => void;
}

export const FundFlowGraph: React.FC<FundFlowGraphProps> = ({ onOpenFreezeModalForNode }) => {
  const {
    graphNodes,
    graphEdges,
    activeScenario,
    setActiveScenario,
    selectedGraphNodeId,
    setSelectedGraphNodeId
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [minAmountFilter, setMinAmountFilter] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'observed' | 'suspected'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [replayPct, setReplayPct] = useState<number>(100);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);

  // Selected node object
  const selectedNode = useMemo(() => {
    return graphNodes.find(n => n.id === selectedGraphNodeId) || null;
  }, [graphNodes, selectedGraphNodeId]);

  // Handle animated replay playback
  useEffect(() => {
    let timer: any;
    if (isPlayingReplay) {
      timer = setInterval(() => {
        setReplayPct(prev => {
          if (prev >= 100) {
            setIsPlayingReplay(false);
            return 100;
          }
          return prev + 5;
        });
      }, 400);
    }
    return () => clearInterval(timer);
  }, [isPlayingReplay]);

  // Compute node coordinates based on hierarchical layers
  const nodePositions = useMemo(() => {
    const layerGroups: { [layer: number]: FundFlowNode[] } = { 0: [], 1: [], 2: [], 3: [] };

    graphNodes.forEach(node => {
      const l = Math.min(3, Math.max(0, node.layer ?? 1));
      if (!layerGroups[l]) layerGroups[l] = [];
      layerGroups[l].push(node);
    });

    const positions: { [nodeId: string]: { x: number; y: number } } = {};
    const layerX = [80, 360, 680, 1000];

    Object.entries(layerGroups).forEach(([layerStr, nodes]) => {
      const l = parseInt(layerStr, 10);
      const total = nodes.length;
      const spacing = Math.max(120, 600 / Math.max(1, total + 1));
      const startY = 80;

      nodes.forEach((n, idx) => {
        positions[n.id] = {
          x: layerX[l],
          y: startY + idx * spacing + (l === 2 ? 20 : 40)
        };
      });
    });

    return positions;
  }, [graphNodes]);

  // Filter edges based on replayPct, minAmountFilter, and scenario
  const filteredEdges = useMemo(() => {
    const sorted = [...graphEdges].sort((a, b) => a.amount - b.amount);
    const limitIndex = Math.ceil((replayPct / 100) * sorted.length);
    const activeTimeSlice = new Set(sorted.slice(0, limitIndex).map(e => e.id));

    return graphEdges.filter(e => {
      if (replayPct < 100 && !activeTimeSlice.has(e.id)) return false;
      if (minAmountFilter > 0 && e.amount < minAmountFilter) return false;
      if (statusFilter === 'observed' && e.status === 'SUSPICIOUS') return false;
      if (statusFilter === 'suspected' && e.status !== 'SUSPICIOUS') return false;

      // Scenario filter focus
      if (activeScenario === 'CLEAN_PAYMENT') {
        if (e.target !== 'ACC-7712-3305' && e.source !== 'ACC-7712-3305' && e.source !== 'ACC-4471-0921') return false;
      } else if (activeScenario === 'SMURFING_RING') {
        if (e.target === 'ACC-7712-3305') return false;
      } else if (activeScenario === 'TELEGRAM_SCAM') {
        if (e.target === 'ACC-7712-3305' || e.target === 'ACC-9081-2246') return false;
      }

      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matchesSource = e.source.toLowerCase().includes(s);
        const matchesTarget = e.target.toLowerCase().includes(s);
        const matchesTxn = e.transactionId.toLowerCase().includes(s);
        if (!matchesSource && !matchesTarget && !matchesTxn) return false;
      }

      return true;
    });
  }, [graphEdges, replayPct, minAmountFilter, statusFilter, activeScenario, searchTerm]);

  // Filter nodes visible in active edges + customer root
  const filteredNodes = useMemo(() => {
    const activeNodeIds = new Set<string>(['ACC-4471-0921']);
    filteredEdges.forEach(e => {
      activeNodeIds.add(e.source);
      activeNodeIds.add(e.target);
    });

    return graphNodes.filter(n => {
      if (!activeNodeIds.has(n.id)) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matchesId = n.id.toLowerCase().includes(s);
        const matchesOwner = n.ownerName.toLowerCase().includes(s);
        const matchesLabel = n.label.toLowerCase().includes(s);
        if (!matchesId && !matchesOwner && !matchesLabel) return false;
      }
      return true;
    });
  }, [graphNodes, filteredEdges, searchTerm]);

  const totalTracedAmount = useMemo(() => {
    return filteredEdges.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredEdges]);

  const getNodeColor = (node: FundFlowNode) => {
    if (node.status === 'FROZEN') return '#64748b';
    if (node.status === 'FREEZE_PENDING') return '#f97316';
    if (node.type === 'CUSTOMER') return '#0284c7';
    if (node.type === 'CRYPTO') return '#8b5cf6';
    if (node.type === 'CASHOUT') return '#e11d48';
    if (node.riskScore >= 80) return '#dc2626';
    if (node.riskScore >= 50) return '#d97706';
    return '#10b981';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[820px]">
      
      {/* Top Controls Header (Blue Gradient) */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-4 border-b border-blue-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/30 border border-blue-500/40 rounded-xl text-teal-300">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">Graph 1: Fund-Flow Multi-Hop Tracing Graph</h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Live Money Trail
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive directional fund dispersion tracking origin → recipient hub → intermediary mules → cashout/crypto.
            </p>
          </div>
        </div>

        {/* 4 Interactive Scenarios Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Scenarios:</span>
          {(
            [
              { id: 'ONE_CRORE', label: '₹1 Cr Layering Hub' },
              { id: 'TELEGRAM_SCAM', label: 'Telegram Scam' },
              { id: 'SMURFING_RING', label: 'Hidden Mule Link' },
              { id: 'CLEAN_PAYMENT', label: 'Clean Merchant' }
            ] as const
          ).map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeScenario === sc.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Search & Zoom */}
        <div className="flex items-center space-x-2">
          <div className="relative w-44 sm:w-52">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Account ID or Txn..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-400 placeholder-slate-400"
            />
          </div>

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
      </div>

      {/* Replay Slider & Filters Ribbon */}
      <div className="bg-slate-850 px-6 py-2.5 border-b border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4">
        {/* Replay the money trail controls */}
        <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
          <button
            onClick={() => {
              if (replayPct >= 100) setReplayPct(10);
              setIsPlayingReplay(prev => !prev);
            }}
            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1 shadow-sm transition-colors"
          >
            {isPlayingReplay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlayingReplay ? 'Pause' : 'Play Replay'}</span>
          </button>

          <div className="flex-1 flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 whitespace-nowrap">Timeline Replay ({replayPct}%):</span>
            <input
              type="range"
              min="10"
              max="100"
              value={replayPct}
              onChange={e => setReplayPct(parseInt(e.target.value, 10))}
              className="w-full accent-teal-400 bg-slate-700 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Amount & Status Filters */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 text-[11px]">Min Amount:</span>
            <select
              value={minAmountFilter}
              onChange={e => setMinAmountFilter(parseInt(e.target.value, 10))}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="0">Any Amount</option>
              <option value="50000">₹50k+</option>
              <option value="100000">₹1 Lakh+</option>
              <option value="1000000">₹10 Lakh+</option>
              <option value="5000000">₹50 Lakh+</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 text-[11px]">Edge Type:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="all">All Transfers</option>
              <option value="observed">Observed Only</option>
              <option value="suspected">Suspected Links</option>
            </select>
          </div>

          <div className="text-teal-400 font-mono font-bold text-xs pl-2 border-l border-slate-700">
            Traced: {formatINR(totalTracedAmount)}
          </div>
        </div>
      </div>

      {/* Main Canvas + Account Dossier Panel */}
      <div className="flex-1 relative flex overflow-hidden bg-slate-950">
        
        {/* SVG Canvas */}
        <div className="flex-1 h-full overflow-auto relative p-4">
          <svg
            className="w-full h-full min-w-[1100px] min-h-[640px]"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.15s ease' }}
          >
            <defs>
              <marker
                id="ff-arrow-flagged"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
              </marker>
              <marker
                id="ff-arrow-normal"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#14b8a6" />
              </marker>
            </defs>

            {/* Column Guide Guidelines */}
            <g className="opacity-15">
              <line x1="80" y1="40" x2="80" y2="600" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="360" y1="40" x2="360" y2="600" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="680" y1="40" x2="680" y2="600" stroke="#94a3b8" strokeDasharray="4 4" />
              <line x1="1000" y1="40" x2="1000" y2="600" stroke="#94a3b8" strokeDasharray="4 4" />
            </g>

            {/* Layer Column Headers */}
            <g className="text-[11px] font-mono fill-slate-500 font-bold uppercase tracking-wider">
              <text x="80" y="30" textAnchor="middle">Hop 0: Origin Account</text>
              <text x="360" y="30" textAnchor="middle">Hop 1: Recipient Hub</text>
              <text x="680" y="30" textAnchor="middle">Hop 2: Mule Dispersion</text>
              <text x="1000" y="30" textAnchor="middle">Hop 3: Off-Ramp / Cashout</text>
            </g>

            {/* Render Edges */}
            <g>
              {filteredEdges.map(edge => {
                const sourcePos = nodePositions[edge.source];
                const targetPos = nodePositions[edge.target];
                if (!sourcePos || !targetPos) return null;

                const isSelected = selectedGraphNodeId === edge.source || selectedGraphNodeId === edge.target;
                const isFlagged = edge.status === 'FLAGGED' || edge.amount >= 100000;

                const midX = (sourcePos.x + targetPos.x) / 2;
                const midY = (sourcePos.y + targetPos.y) / 2;
                const pathData = `M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${sourcePos.y} ${targetPos.x} ${targetPos.y}`;

                return (
                  <g key={edge.id} className="group cursor-pointer">
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isFlagged ? '#f43f5e' : '#14b8a6'}
                      strokeWidth={isSelected ? 3.5 : isFlagged ? 2.5 : 1.8}
                      strokeOpacity={isSelected ? 1 : 0.75}
                      strokeDasharray={edge.status === 'SUSPICIOUS' ? '6 4' : 'none'}
                      markerEnd={isFlagged ? 'url(#ff-arrow-flagged)' : 'url(#ff-arrow-normal)'}
                    />

                    {/* Edge Label Pill */}
                    <g transform={`translate(${midX}, ${(sourcePos.y + targetPos.y) / 2 - 8})`}>
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="20"
                        rx="6"
                        fill="#0f172a"
                        stroke={isFlagged ? '#e11d48' : '#0d9488'}
                        strokeWidth="1"
                        className="opacity-95"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isFlagged ? '#fca5a5' : '#5eead4'}
                        className="text-[10px] font-mono font-bold"
                      >
                        {formatINRCompact(edge.amount)}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Render Nodes */}
            <g>
              {filteredNodes.map(node => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = selectedGraphNodeId === node.id;
                const nodeColor = getNodeColor(node);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedGraphNodeId(node.id)}
                    className="cursor-pointer group"
                  >
                    {isSelected && (
                      <circle
                        r="30"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ animationDuration: '6s' }}
                      />
                    )}

                    <circle
                      r="22"
                      fill="#0f172a"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 3.5 : 2.5}
                      className="transition-all group-hover:scale-110 shadow-lg"
                    />

                    <circle
                      r="14"
                      fill={nodeColor}
                      fillOpacity={0.85}
                    />

                    <text
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[10px] font-mono font-bold"
                    >
                      {node.type === 'CUSTOMER' ? 'C' : node.type === 'CRYPTO' ? '₿' : node.type === 'CASHOUT' ? '₹' : 'M'}
                    </text>

                    <text
                      y="36"
                      textAnchor="middle"
                      fill="#f8fafc"
                      className="text-[11px] font-bold group-hover:fill-teal-300 transition-colors pointer-events-none"
                    >
                      {node.label}
                    </text>

                    <text
                      y="48"
                      textAnchor="middle"
                      fill="#94a3b8"
                      className="text-[9px] font-mono pointer-events-none"
                    >
                      {node.id}
                    </text>

                    {/* Risk Badge Pill */}
                    <g transform="translate(0, -28)">
                      <rect
                        x="-20"
                        y="-7"
                        width="40"
                        height="14"
                        rx="4"
                        fill={nodeColor}
                        fillOpacity={0.9}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ffffff"
                        className="text-[8px] font-mono font-extrabold"
                      >
                        {node.riskScore}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Prototype disclaimer tag */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-2">
            <Info className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span>Interactive Multi-Hop Fund Trail: Solid lines = observed transfers, dashed = suspected links.</span>
          </div>
        </div>

        {/* Slide-out Account Dossier Inspector (Blue Gradient) */}
        {selectedNode && (
          <div className="w-80 md:w-96 bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-900 border-l border-blue-800/50 p-6 overflow-y-auto space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
                <h4 className="font-bold text-sm uppercase tracking-wider text-teal-300">
                  Account Dossier
                </h4>
              </div>
              <button
                onClick={() => setSelectedGraphNodeId(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 font-semibold">{selectedNode.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  getRiskBadgeClasses(selectedNode.riskLevel).badge
                }`}>
                  {selectedNode.riskLevel} ({selectedNode.riskScore}/100)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{selectedNode.ownerName}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {selectedNode.bank} • {selectedNode.location}
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2.5 ${
              selectedNode.status === 'FROZEN'
                ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                : selectedNode.status === 'FREEZE_PENDING'
                ? 'bg-amber-950/80 border-amber-700 text-amber-200'
                : selectedNode.flagged
                ? 'bg-red-950/60 border-red-800 text-red-200'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
            }`}>
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <div>
                <span className="font-bold">Status: {selectedNode.status.replace(/_/g, ' ')}</span>
                <p className="text-[10px] opacity-80">
                  {selectedNode.status === 'FROZEN'
                    ? 'Account debit frozen under IT Act simulated hold.'
                    : selectedNode.status === 'FREEZE_PENDING'
                    ? 'Account Freeze Request pending bank sign-off.'
                    : selectedNode.flagged
                    ? 'Flagged by ML Graph Neural Network as active layering mule.'
                    : 'Normal account.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[11px]">Current Balance</span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {formatINR(selectedNode.balance)}
                </div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-[11px]">Layer / Hop</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  Hop {selectedNode.layer} ({selectedNode.type})
                </div>
              </div>
            </div>

            {onOpenFreezeModalForNode && selectedNode.type !== 'CUSTOMER' && (
              <div className="pt-2">
                <button
                  onClick={() => onOpenFreezeModalForNode(selectedNode)}
                  disabled={selectedNode.status === 'FROZEN'}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                    selectedNode.status === 'FROZEN'
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {selectedNode.status === 'FROZEN'
                      ? 'Account Already Frozen'
                      : 'Submit Simulated Freeze Request'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
