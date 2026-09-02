import dayjs from "dayjs"
import { useState } from "react"
import { theme, iconStyle } from "../../lib/theme";
import EditIcon from '@mui/icons-material/Edit';
import LinkRounded from '@mui/icons-material/LinkRounded';
import React from "react";

interface InfoOwnerDetailsProps {
  owner: any,
}

export function InfoOwnerDetails({ owner }: InfoOwnerDetailsProps) {

  const [getLinkModal, setGetLinkModal] = React.useState(false);

  return (
    <div key='infoOwner' className="flex flex-col p-3 border-2 border-neutral-200 rounded-3xl w-[650px] md:w-full mt-1">
      {/*
      <div className="flex flex-col mb-3 px-2">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-80 md:mt-1">
            <span className="font-semibold mt-1 ">Owner: </span>
            <span>{owner.name}</span>
          </div>
          <div className="md:ml-5 md:w-80 mt-1 ">
            <span className="font-semibold">Second Owner: </span>
            <span>{owner.secondOwner}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mt-1 ">
          <div className="md:w-80">
            <span className="font-semibold">Phone: </span>
            <span>{owner.phoneOne}</span>
          </div>
          <div className="md:ml-5 md:w-80 mt-1 ">
            <span className="font-semibold">Second Phone: </span>
            <span>{owner.phoneTwo != null && owner.phoneTwo != undefined ? owner.phoneTwo : ""}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mt-1  ">
          <div className="md:w-80">
            <span className="font-semibold">Email: </span>
            <span>{owner.emailAddress == null || owner.emailAddress == undefined ? "" : owner.emailAddress}</span>
          </div>
          <div className="md:ml-5 md:w-80 mt-1 ">
            <span className="font-semibold">Address: </span>
            <span>{owner.address != null && owner.address != undefined ? owner.address : ""}</span>
          </div>
        </div>
        <div className="mt-1">
          <span className="font-semibold">Notes: </span>
          <span>{owner.notes != null && owner.notes != undefined ? owner.notes : ""}</span>
        </div>
      </div>*/}
      {owner != undefined ?
        <div>
          <div id="columnsOwnerMainDetails" className="w-[640px] md:w-full flex justify-center text-center">
            <span className="font-semibold w-36">Owner</span>
            <span className="font-semibold w-36">Phone</span>
            <span className="font-semibold w-36">Second Owner</span>
            <span className="font-semibold w-36">Second Phone</span>
          </div>
          <div id="OwnerDetailsMainRow" className="w-[640px] md:w-full flex justify-center text-center">
            <span className="w-36">{owner.name}</span>
            <span className="w-36">{owner.phoneOne}</span>
            <span className="w-36">{owner.secondOwner}</span>
            <span className="w-36">{owner.phoneTwo}</span>
          </div>
          <div id="columnsOwnerOtherDetails" className="w-[640px] md:w-full flex justify-center text-center mt-1">
            <span className="font-semibold w-36">Email</span>
            <span className="font-semibold w-96">Address</span>
          </div>
          <div id="OwnerDetailsOtherRow" className="w-[640px] md:w-full flex justify-center text-center mb-1">
            <span className="w-36">{owner.email == null ? "" : owner.email}</span>
            <span className="w-96">{owner.address}</span>
          </div>
        </div>
        : null}
      {owner.dogs != undefined && owner.dogs != null ?
        <>
          <div className="md:px-10">
            <div className="h-[1px] w-[625px] md:w-full my-1 bg-neutral-300"></div>
          </div>
          <div id="dogsColumn" className="mt-1 w-[640px] md:w-full flex justify-center text-center">
            <span className="font-semibold w-28 lg:w-36">Dog</span>
            <span className="font-semibold w-28 lg:w-36">Breed</span>
            <span className="font-semibold w-32 lg:w-40">Birthday</span>
            <span className="font-semibold w-28 lg:w-36">Nickname</span>
            <span className="font-semibold w-16 lg:w-28">Gender</span>
            <span className="font-semibold w-28 lg:w-36">Colour</span>
          </div>
          {owner.dogs.map((dog: any) => (
            <div key={`Dog_${dog.name}`} className="w-full">
              <div className="w-[640px] md:w-full flex justify-center text-center h-12 mb-1 items-center">
                <span className="w-28 lg:w-36">{dog.name}</span>
                <span className="w-28 lg:w-36">{dog.breed}</span>

                <div className="w-32 lg:w-40">
                  {dog.birthdayDate != null && dog.birthdayDate != "" ?
                    <span className="w-32 lg:w-40 flex flex-col text-center">
                      <span className="">{`${dayjs(dog.birthdayDate).format('DD/MM/YYYY')}`}</span>
                      <span className="">{`${dayjs().diff(dayjs(dog.birthdayDate), 'years')} yrs ${(dayjs().diff(dayjs(dog.birthdayDate), 'months', true) % 12).toFixed(2)} mon`}</span>
                    </span>
                    : ""}
                </div>

                <span className="w-28 lg:w-36">{dog.nickname != null && dog.nickname != undefined ? dog.nickname : ""}</span>
                <span className="w-16 lg:w-28">{dog.gender != null && dog.gender != undefined ? dog.gender : ""}</span>
                <span className="w-28 lg:w-36">{dog.colour != null && dog.colour != undefined ? dog.colour : ""}</span>

              </div>
              {/*<div className="flex flex-col p-2 mt-2 border-2 border-neutral-200 rounded-xl" key={dog.id}>
            <div className="flex flex-col md:flex-row ">
              <div className="md:w-60 md:mt-1">
                <span className="font-semibold">Dog: </span>
                <span>{dog.name}</span>
              </div>
              <div className="md:ml-5 md:w-60 mt-1">
                <span className="font-semibold">Breed: </span>
                <span>{dog.breed}</span>
              </div>
              <div className="md:ml-5 md:w-70 mt-1">
                <span className="font-semibold">Birthday: </span>
                <span>{dog.birthdayDate != null && dog.birthdayDate != "" ? `${dayjs(dog.birthdayDate).format('DD/MM/YYYY')} ${dayjs().diff(dayjs(dog.birthdayDate), 'years')} yrs ${(dayjs().diff(dayjs(dog.birthdayDate), 'months', true) % 12).toFixed(2)} mon` : ""}</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row mt-1">
              <div className="md:w-60">
                <span className="font-semibold">Nickname: </span>
                <span>{dog.nickname != null && dog.nickname != undefined ? dog.nickname : ""}</span>
              </div>
              <div className="md:ml-5 md:w-60 mt-1 ">
                <span className="font-semibold">Gender: </span>
                <span>{dog.gender != null && dog.gender != undefined ? dog.gender : ""}</span>
              </div>
              <div className="md:ml-5 md:w-60 mt-1 ">
                <span className="font-semibold">Colour: </span>
                <span>{dog.colour != null && dog.colour != undefined ? dog.colour : ""}</span>
              </div>
            </div>
          </div>*/}
              

            </div>
          ))}
        </> : null}

        {owner.notes != undefined && owner.notes != null && owner.notes.trim() != '' ?
                <>
                  <div className="md:px-10 mt-4 mb-4">
                    <div className="h-[1px] w-[625px] md:w-full my-1 bg-neutral-300"></div>
                  </div>
                  <div className="flex justify-center my-1 mx-4">
                    <span className="font-semibold mr-2">Owner Note:</span>
                    <span>{owner.notes}</span>
                  </div>
                </>
                : null}
              <div>
                <div className="w-full flex mt-4 mb-4 justify-center">
                  <div className="h-[1px] w-96 my-1 bg-neutral-300"></div>
                </div>
                <div id="actionsButtonInfo" className="flex justify-center">
                  <button className="mr-3" onClick={() => setGetLinkModal(true)}>
                    <EditIcon sx={iconStyle} />
                  </button>
                  <button onClick={() => setGetLinkModal(true)}>
                    <LinkRounded sx={iconStyle} />
                  </button>
                </div>
              </div>

    </div>

  )
}