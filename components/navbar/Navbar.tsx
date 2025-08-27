import Container from "../global/Container"
import CartButton from "./CartButton"
import ThemeDropdownButton from "./ThemeDropdownButton"
import LinksDropdown from "./LinksDropdown"
import Logo from "./Logo"
import NavSearch from "./NavSearch"
import { Suspense } from "react"
import { nodeEnvironment } from "@/utils/env"

function Navbar() {
  return (
    <>
      {nodeEnvironment !== "production" && (
        <>
          <div className='text-sm text-yellow-600 font-semibold text-center'>
            ⚠️ SITE IN {nodeEnvironment.toUpperCase()} MODE ⚠️
          </div>
          <hr />
        </>
      )}
      <nav className='border-b'>
        <Container className='flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-8 gap-4'>
          <Logo />
          <Suspense>
            <NavSearch />
          </Suspense>
          <div className='flex gap-4 items-center'>
            <CartButton />
            <ThemeDropdownButton />
            <LinksDropdown />
          </div>
        </Container>
      </nav>
    </>
  )
}
export default Navbar
