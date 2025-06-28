ame="text-gray-400 text-sm">Access Attempts</span>
                                        <span className="text-yellow-400 font-mono">{securityMetrics.accessAttempts}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Breach Alerts</span>
                                        <span className="text-green-400 font-mono">{securityMetrics.breachAlerts}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Active Personnel</span>
                                        <span className="text-green-400 font-mono">{securityMetrics.activePersonnel}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Row - System Performance */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title text-sm">SYSTEM PERFORMANCE</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">CPU Usage</span>
                                    <span className="text-yellow-400 font-mono">{systemMetrics.cpuUsage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Memory</span>
                                    <span className="text-green-400 font-mono">{systemMetrics.memoryUsage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Disk Space</span>
                                    <span className="text-green-400 font-mono">{systemMetrics.diskSpace}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Network</span>
                                    <span className="text-green-400 font-mono">{systemMetrics.networkTraffic}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row - Warnings */}
                        <div className="card card-danger">
                            <div className="card-header">
                                <h2 className="card-title text-sm text-red-400">SYSTEM ALERTS</h2>
                            </div>
                            <div className="text-sm text-red-300 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span>Neural interface anomaly detected in Sector 7</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span>Consciousness transfer protocol requires calibration</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <span>Reality anchor stability below optimal threshold</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span>Temporal displacement monitoring active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Information */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-green-400 font-mono text-sm mb-2">EMERGENCY CONTACTS</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                            <div>Security: Ext. 2847</div>
                            <div>Medical: Ext. 3156</div>
                            <div>Technical: Ext. 4729</div>
                            <div>Command: Ext. 1001</div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-green-400 font-mono text-sm mb-2">FACILITY SPECIFICATIONS</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                            <div>Neural Cores: 16 Active</div>
                            <div>Quantum Processors: 8 Online</div>
                            <div>Memory Banks: 2.1 PB</div>
                            <div>Power Grid: 2.4 MW</div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-green-400 font-mono text-sm mb-2">CLASSIFICATION</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                            <div>Level: TOP SECRET//SCI</div>
                            <div>Compartment: COSMIC</div>
                            <div>Project: VESSEL</div>
                            <div>Facility: 05-B</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Research Log Modal */}
            {showLogModal && selectedLog && (
                <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
                    <div className="modal-content max-w-4xl" onClick={e => e.stopPropagation()}>
                        <div className="mb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className={`text-xl font-bold ${selectedLog.corrupted ? 'text-red-400' : 'text-green-400'}`}>
                                    {selectedLog.title}
                                </h2>
                                <button
                                    onClick={() => setShowLogModal(false)}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">
                                <span className="font-mono">{selectedLog.id}</span> | 
                                <span className="ml-2">{selectedLog.researcher}</span> | 
                                <span className="ml-2">{selectedLog.date}</span> | 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                    selectedLog.classification === 'COSMIC' ? 'bg-purple-900/50 text-purple-300' :
                                    selectedLog.classification === 'TOP SECRET' ? 'bg-red-900/50 text-red-300' :
                                    selectedLog.classification === 'SECRET' ? 'bg-orange-900/50 text-orange-300' :
                                    'bg-blue-900/50 text-blue-300'
                                }`}>
                                    {selectedLog.classification}
                                </span>
                            </div>
                        </div>
                        <div className={`terminal ${selectedLog.corrupted ? 'border-red-500/50' : ''}`}>
                            <div className="terminal-content">
                                <pre className={`whitespace-pre-wrap text-sm ${
                                    selectedLog.corrupted ? 'text-red-300' : 'text-green-300'
                                }`}>
                                    {selectedLog.content}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* System Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h2 className="text-xl font-bold text-green-400 mb-4">SYSTEM NOTIFICATION</h2>
                            <p className="text-gray-300 mb-6">{modalMessage}</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-primary"
                            >
                                ACKNOWLEDGE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}