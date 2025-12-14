'use client';

import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";

const TERM_BG = '#000000';
const TERM_GREEN = '#00ff66';

export default function WhiteRoomPage() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState<'explore' | 'darkening' | 'turn' | 'complete'>('explore');
    const [instructions, setInstructions] = useState('Click to enter the vessel');
    const access = useChapter4Access();
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<PointerLockControls | null>(null);
    const playerRef = useRef({
        velocity: new THREE.Vector3(),
        direction: new THREE.Vector3(),
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        canJump: false,
        position: new THREE.Vector3(0, 1.6, 0)
    });

    if (!access) return <div style={{
        height: '100vh',
        background: TERM_BG,
        color: TERM_GREEN,
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>Booting the room...</div>;

    const roadProgressRef = useRef(0);
    const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
    const turningRef = useRef(false);
    const currentRotationRef = useRef(0);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 10, 100);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.copy(playerRef.current.position);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambientLight);
        ambientLightRef.current = ambientLight;

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5f5,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // White tree in distance
        const treeGroup = new THREE.Group();
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee});
        const trunk = new THREE.Mesh(trunkGeometry, treeMaterial);
        trunk.position.y = 2;
        treeGroup.add(trunk);

        // Tree branches
        for (let i = 0; i < 5; i++) {
            const branchGeometry = new THREE.CylinderGeometry(0.1, 0.15, 2, 6);
            const branch = new THREE.Mesh(branchGeometry, treeMaterial);
            branch.position.y = 2 + i * 0.5;
            branch.position.x = (Math.random() - 0.5) * 1.5;
            branch.rotation.z = (Math.random() - 0.5) * 0.5;
            treeGroup.add(branch);
        }

        treeGroup.position.set(-10, 0, -15);
        scene.add(treeGroup);

        // Road (dark path)
        const roadGeometry = new THREE.PlaneGeometry(4, 100);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.9
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0.01, -50);
        scene.add(road);

        // Strings hanging from above (looking up reveals them)
        const stringMaterial = new THREE.LineBasicMaterial({color: 0xdddddd});
        for (let i = 0; i < 20; i++) {
            const points = [];
            const x = (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 30;
            points.push(new THREE.Vector3(x, 15, z));
            points.push(new THREE.Vector3(x + (Math.random() - 0.5) * 2, 0, z + (Math.random() - 0.5) * 2));

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, stringMaterial);
            scene.add(line);
        }

        // Controls
        const controls = new PointerLockControls(camera, renderer.domElement);
        controlsRef.current = controls;

        controls.addEventListener('lock', () => {
            setInstructions('');
            setLoading(false);
        });

        controls.addEventListener('unlock', () => {
            if (phase === 'explore') {
                setInstructions('Click to continue');
            }
        });

        renderer.domElement.addEventListener('click', () => {
            if (phase === 'explore' && !turningRef.current) {
                controls.lock();
            }
        });

        // Keyboard controls
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW':
                    playerRef.current.moveForward = true;
                    break;
                case 'KeyS':
                    playerRef.current.moveBackward = true;
                    break;
                case 'KeyA':
                    playerRef.current.moveLeft = true;
                    break;
                case 'KeyD':
                    playerRef.current.moveRight = true;
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW':
                    playerRef.current.moveForward = false;
                    break;
                case 'KeyS':
                    playerRef.current.moveBackward = false;
                    break;
                case 'KeyA':
                    playerRef.current.moveLeft = false;
                    break;
                case 'KeyD':
                    playerRef.current.moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        // Animation loop
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            if (phase === 'explore' && controls.isLocked) {
                const player = playerRef.current;

                // Update velocity
                player.velocity.x -= player.velocity.x * 10.0 * delta;
                player.velocity.z -= player.velocity.z * 10.0 * delta;

                player.direction.z = Number(player.moveForward) - Number(player.moveBackward);
                player.direction.x = Number(player.moveRight) - Number(player.moveLeft);
                player.direction.normalize();

                if (player.moveForward || player.moveBackward) {
                    player.velocity.z -= player.direction.z * 40.0 * delta;
                }
                if (player.moveLeft || player.moveRight) {
                    player.velocity.x -= player.direction.x * 40.0 * delta;
                }

                controls.moveRight(-player.velocity.x * delta);
                controls.moveForward(-player.velocity.z * delta);

                // Track progress along road
                if (camera.position.z < -10) {
                    roadProgressRef.current = Math.abs(camera.position.z);

                    // Start darkening after traveling far enough
                    if (roadProgressRef.current > 30 && phase === 'explore') {
                        setPhase('darkening');
                        setInstructions('Something is changing...');
                    }
                }
            } else if (phase === 'darkening') {
                // Gradually darken the scene
                if (ambientLightRef.current && ambientLightRef.current.intensity > 0.01) {
                    ambientLightRef.current.intensity -= 0.3 * delta;
                    scene.fog = new THREE.Fog(0x000000, 5, 30);
                    renderer.setClearColor(0x000000);
                } else {
                    // Lock controls and start turning
                    setPhase('turn');
                    turningRef.current = true;
                    controls.unlock();
                    setInstructions('');
                }
            } else if (phase === 'turn' && turningRef.current) {
                // Slowly turn camera around 180 degrees
                currentRotationRef.current += 0.3 * delta;
                camera.rotation.y = currentRotationRef.current;

                // Point camera straight
                camera.rotation.x = 0;

                if (currentRotationRef.current >= Math.PI) {
                    // Turn complete - close tab
                    setPhase('complete');
                    turningRef.current = false;

                    // Set completion status
                    try {
                        const cookieKey = 'chapterIV-plaque-progress';
                        const cur = getJsonCookie(cookieKey) || {};
                        cur['WhiteRoom'] = 2;
                        setJsonCookie(cookieKey, cur, 365);
                    } catch (e) {
                    }

                    // Show final message then close
                    setInstructions('You have seen enough.');

                    setTimeout(() => {
                        window.close();
                        // Fallback if window.close() doesn't work
                        setTimeout(() => {
                            window.location.href = 'about:blank';
                        }, 1000);
                    }, 2000);
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        // Window resize
        const handleResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [phase]);

    // Cookie helpers
    function getJsonCookie(name: string): any | null {
        try {
            const match = document.cookie.split(';').map(s => s.trim()).find(c => c.startsWith(name + '='));
            if (!match) return null;
            return JSON.parse(decodeURIComponent(match.split('=')[1] || ''));
        } catch (e) {
            return null;
        }
    }

    function setJsonCookie(name: string, obj: any, days = 365) {
        try {
            const v = encodeURIComponent(JSON.stringify(obj));
            const d = new Date();
            d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${v}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
        } catch (e) {
        }
    }

    return (
        <div style={{width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: '#000'}}>
            <div ref={mountRef} style={{width: '100%', height: '100%'}}/>

            {instructions && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: phase === 'explore' ? '#000' : '#fff',
                    fontSize: '24px',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    textShadow: phase === 'explore' ? '2px 2px 4px rgba(255,255,255,0.8)' : '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                    {instructions}
                    {phase === 'explore' && !loading && (
                        <div style={{marginTop: '20px', fontSize: '16px'}}>
                            Use WASD to move • Look around with mouse
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#000',
                    fontSize: '18px',
                    fontFamily: 'monospace',
                }}>
                    Loading vessel...
                </div>
            )}
        </div>
    );
}

