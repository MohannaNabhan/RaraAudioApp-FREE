import { APP } from '@/utils/consts.js'
import CopyTextBtn from '@/components/others/CopyTextBtn.jsx'
import cutText from '@/hooks/cutText.js'

/*<div className="w-[5px] min-h-[100px] _no_move   bg-[var(--color-green)] relative -ml-2  -mt-2 "></div>*/

function Mode({ mode, msg, Set, Sett, data }) {
  if (mode == 'support') {
    return (
      <div className="w-[360px] relative  _no_move h-full flex gap-x-2">
        <div className="w-full">
          <h1 className="text-xs mb-3 text-center">You Have Received a Message from Support</h1>
          <p className="text-xs mb-4">Ticket {msg?.title}</p>
          <p className="text-xs">Support: Message from Support</p>

          <div className="w-full flex justify-end pr-4">
            <a
              onClick={() => {
                Set(false)
                Sett(null)
              }}
              href={APP.url + '/support'}
              target="_blank"
              className="btn btn-main !rounded !px-4 !py-1 !font-medium !text-xs"
            >
              Reply
            </a>
          </div>
        </div>
      </div>
    )
  } else if (mode == 'events') {
    return (
      <div className="w-[500px] relative  _no_move h-full flex gap-x-2 z-50">
        <div className="w-full h-full">
          <h1 className="text-xs mb-5 text-center">Progress of Your Referrals</h1>
          <div className="w-full grid gap-x-2 grid-cols-3  items-center overflow-hidden">
            <span className="text-sm  font-medium ">To Unblocked</span>
            <span className="text-sm  font-medium ">Requirements</span>
            <span className="text-sm  font-medium ">Referral Link</span>
            <h1 className="text-[10px]">{cutText({ t: 'BALANCED', l: 20 })}</h1>
            <p className="text-[10px]">Referred Users: 5/10</p>
            <CopyTextBtn className="text-[10px]" text="raraaudioapp.com/kfjshdLASD" />
            <h1 className="text-[10px]">{cutText({ t: 'BALANCED', l: 20 })}</h1>
            <p className="text-[10px]">Referred Users: 5/10</p>
            <CopyTextBtn className="text-[10px]" text="raraaudioapp.com/kfjshdLASD" />
            <h1 className="text-[10px]">{cutText({ t: 'BALANCED', l: 20 })}</h1>
            <p className="text-[10px]">Referred Users: 5/10</p>
            <CopyTextBtn className="text-[10px]" text="raraaudioapp.com/kfjshdLASD" />
            <h1 className="text-[10px]">{cutText({ t: 'BALANCED', l: 20 })}</h1>
            <p className="text-[10px]">Referred Users: 5/10</p>
            <CopyTextBtn className="text-[10px]" text="raraaudioapp.com/r/kfjshdL" />
          </div>
        </div>
      </div>
    )
  } else if (mode == 'alerts') {
    return (
      <div className="w-[360px] z-[9999] relative  _no_move h-full flex gap-x-2">
        <div className="w-full">
          <h1 className="text-xs mb-3 text-center">New Referred User</h1>
          <p className="text-xs mb-3">[User Name], has signed up using your referral code.</p>
          <div className="w-full flex justify-center">
            <button
              onClick={() => {
                Set(false)
                Sett('events')
              }}
              className="btn btn-main !rounded !px-4 !py-1 !font-medium !text-xs"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default function NotificationBtnSubMenu({ mode, msg, Set, Sett }) {
  return Mode({ mode, msg, Set, Sett })
}
