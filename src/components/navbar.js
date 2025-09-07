import React from 'react'
import ThemeToggle from './ThemeToggle';

const Navbar = () => {

  return (
    <div className="navbar fixed top-0 bg-base-100 z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href='#'>TODOs na-ive</a>
        </div>
        <div className="flex-none">
          <ThemeToggle />
        </div>
      </div>
  )
}

export default Navbar