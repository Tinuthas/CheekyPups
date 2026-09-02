import { useState } from "react"

interface SummaryPaymentProps {
  info: any,
}

export function SummaryPayment({ info }: SummaryPaymentProps) {

  return (
    <div>
      <div className="bg-pinkBackground w-full h-[1px] mt-2 mb-1"></div>
      <div id="summary" className="mb-4 text-medium w-full ">
        <h4 className="font-medium text-xl text-center font-borsok text-pinkBackground m-2">Summary</h4>
        {info != null && info.owner != null && info.daycareTotal != null ?
          <div className="flex justify-between">
            <span>Daycare </span>
            <span>{`€${info.daycareTotal}`}</span>
          </div>
          : null}
        {info != null && info.owner != null && info.fullday != null && info.fullday != 0 ?
          <div className="flex justify-between ml-7 text-sm">
            <span>Full Days (D): </span>
            <span className="">{`${info.fullday}`}</span>
          </div>
          : null}
        {info != null && info.owner != null && info.halfday != null ?
          <div className="flex justify-between ml-7 text-sm">
            <span>Half Days (½D): </span>
            <span className="">{`${info.halfday}`}</span>
          </div>
          : null}
        {info != null && info.owner != null && info.grooming != null ?
          <div className="flex justify-between">
            <span>Grooming </span>
            <span>{`€${info.grooming}`}</span>
          </div>
          : null}
        {info != null && info.owner != null && info.others != null ?
          <div className="flex justify-between">
            <span>Other </span>
            <span>{`€${info.others}`}</span>
          </div>
          : null}
        {info != null && info.owner != null && info.total != null ?
          <div className="flex justify-between mt-2 font-semibold">
            <span>Total </span>
            <span>{`€${info.total}`}</span>
          </div>
          : null}
      </div>
      <div className="bg-pinkBackground w-full h-[1px] mt-2 mb-4"></div>
    </div>
  )
}