import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import {Header} from "../components/Header.tsx";

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
        <main className={'grid grid-cols-1 grid-rows-15 gap-4'}>
            <div className='row-span-2'>
                <Header></Header>
            </div>
            <div className='row-span-10'>

            </div>
            <div className='row-span-3'>

            </div>
        </main>

      <Outlet />
    </React.Fragment>
  )
}
