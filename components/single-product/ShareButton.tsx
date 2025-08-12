"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { BsShare } from "react-icons/bs"

import {
  TwitterShareButton as XShareButton,
  EmailShareButton,
  LinkedinShareButton,
  XIcon,
  EmailIcon,
  LinkedinIcon,
} from "react-share"

function ShareButton({ productId, name }: { productId: string; name: string }) {
  const url = process.env.NEXT_PUBLIC_WEBSITE_URL
  const link = `${url}/products/${productId}`
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"icon"} className='p-2'>
          <BsShare />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='top'
        align='end'
        sideOffset={10}
        className='flex items-center gap-x-2 justify-center w-full'
      >
        <XShareButton url={link} title={name}>
          <XIcon size={32} round />
        </XShareButton>
        <LinkedinShareButton url={link} title={name}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <EmailShareButton url={link} subject={name}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </PopoverContent>
    </Popover>
  )
}
export default ShareButton
