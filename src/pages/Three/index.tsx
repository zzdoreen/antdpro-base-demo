import { useEffect, useRef } from "react"
import {
    BoxGeometry, BufferGeometry, Line, LineBasicMaterial,
    Mesh, MeshBasicMaterial, PerspectiveCamera, Scene,
    Vector3, WebGLRenderer
} from 'three'

export default () => {
    const threeRef = useRef()

    useEffect(() => {
        if (threeRef.current) {
            // 渲染器
            const renderer = new WebGLRenderer({ canvas: threeRef.current })
            // 透视摄像机
            const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
            // 场景
            const scene = new Scene()

            renderer.setSize(window.innerWidth, window.innerHeight)

            // ---------------- 立方体
            const geometry = new BoxGeometry(1, 1, 1)
            // 材质
            const material = new MeshBasicMaterial({ color: 0x44aa88 })
            // 网格
            const cube = new Mesh(geometry, material)
            scene.add(cube) // 默认坐标 （0 ，0 ，0）
            camera.position.z = 5

            // 立方体渲染场景
            const renderFn = () => {
                requestAnimationFrame(renderFn)
                renderer.render(scene, camera)
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
            }
            renderFn()

            // ---------------- 线条
            const lineMaterial = new LineBasicMaterial({ color: 0x0000ff })
            const points = [
                new Vector3(-2, -1, 0),
                new Vector3(0, 2, 0),
                new Vector3(2, 0, 0),
            ]
            camera.lookAt(0, 0, 0)
            const bufferGeometry = new BufferGeometry().setFromPoints(points)
            const line = new Line(bufferGeometry, lineMaterial)
            scene.add(line)
            renderer.render(scene, camera)

            return () => {
                geometry?.dispose()
                lineMaterial?.dispose()

            }
        }
    }, [threeRef])

    return <canvas ref={threeRef} />
}