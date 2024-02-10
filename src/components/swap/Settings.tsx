/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FunctionComponent } from "react";
import X from "./assets/X.svg";

interface SettingsProps {   
  setOpenSettings: (value: boolean) => void;
  setSetting: (value: boolean) => void;
  setDeadlineTime: (value: any) => any;
  settingsRef: React.Ref<HTMLDivElement>;
}

const Settings: FunctionComponent<SettingsProps> = ({
  setOpenSettings,
  setSetting,
  setDeadlineTime,
  settingsRef,
}) => {
  const [defaultbtn, setDefaultbtn] = useState(true);
  const [standardbtn, setStandardbtn] = useState(false);
  const [fastbtn, setFastbtn] = useState(false);
  const [Instantbtn, setInstantbtn] = useState(false);

  const [zero01, setzero01] = useState(true);
  const [zero5, setzero5] = useState(false);
  const [zeroOne, setzeroOne] = useState(false);

  return (
    <div
      ref={settingsRef}
      className=" ml-2.5 absolute lg:top-[100px] z-20 top-[150px] lg:left-[calc(50%_-_300px)]  rounded-2xl bg-white shadow-xl lg:w-[600px] w-[95%] flex flex-col items-center justify-start p-8 border border-gray-200 gap-[24px] text-black  "
    >
      <div className="self-stretch flex flex-row items-center justify-start">
        <div className="flex-1 flex flex-row items-center justify-end lg:gap-[10px]">
          <div className="flex-1 relative leading-[24px] font-medium">
            Settings
          </div>
          <button
            className="cursor-pointer "
            onClick={() => {
              setOpenSettings(false);
              setSetting(false);
            }}
          >
            <img className="relative w-[18px] h-[18px]" alt="" src={X} />
          </button>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-center gap-[10px]">
        <div className="self-stretch relative leading-[24px] font-medium">
          Transaction speed
        </div>
        <div className=" md:w-auto self-stretch flex flex-row items-start justify-start text-xs text-teal-600 ">
          <div className="flex-1 rounded-xl h-9 flex flex-row items-start justify-start text-white">
            <button
              className={`${
                defaultbtn ? "bg-teal-600 text-white" : "text-teal-600"
              } flex-1  rounded-l-xl border border-teal-600  flex flex-row items-center justify-center py-2.5 px-4 lg:gap-[8px]`}
              onClick={() => {
                setFastbtn(false);
                setDefaultbtn(true);
                setInstantbtn(false);
                setStandardbtn(false);
              }}
            >
              <div className="relative leading-[16px] font-medium">Default</div>
            </button>
          </div>
          <div
            className={`${
              standardbtn ? "bg-teal-600 text-white" : ""
            } flex-1   h- flex flex-row items-start justify-start ml-[-1px]`}
          >
            <button
              className={`flex-1 flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] border-[1px] border-teal-600 `}
              onClick={() => {
                setFastbtn(false);
                setDefaultbtn(false);
                setInstantbtn(false);
                setStandardbtn(true);
              }}
            >
              <div className={`relative leading-[16px] font-medium `}>
                Standard
              </div>
            </button>
          </div>
          <div
            className={`${
              fastbtn ? "bg-teal-600 text-white" : "text-teal-600"
            } flex-1  flex flex-row items-start justify-start ]`}
          >
            <button
              className={`flex-1 flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] border-y-[1px] border-solid border-teal-600`}
            >
              <div
                className="relative leading-[16px] font-medium"
                onClick={() => {
                  setFastbtn(true);
                  setDefaultbtn(false);
                  setInstantbtn(false);
                  setStandardbtn(false);
                }}
              >
                Fast
              </div>
            </button>
          </div>

          <div className="flex-1 rounded-round-buttons h-9 flex flex-row items-start justify-start ml-[-1px]">
            <button
              className={` ${
                Instantbtn ? "bg-teal-600 text-white" : ""
              } flex-1  rounded-r-xl  flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] border-[1px] border-solid border-teal-600 `}
              onClick={() => {
                setFastbtn(false);
                setDefaultbtn(false);
                setInstantbtn(true);
                setStandardbtn(false);
              }}
            >
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0 hidden"
                alt=""
                src="/left-icon5.svg"
              />
              <div className="relative leading-[16px] font-medium">Instant</div>
            </button>
          </div>
        </div>
      </div>
      <div className=" self-stretch flex flex-col items-start justify-center gap-[10px]">
        <div className="self-stretch relative leading-[24px] font-medium">
          Slippage tolerance
        </div>
        <div className="self-stretch flex flex-row items-center justify-start gap-[10px] text-xs text-teal-600">
          <div className="w-[401px] flex flex-row items-start justify-start">
            <div
              className={`${
                zero01 ? "bg-teal-600 text-white" : "text-teal-600"
              } flex-1  md:h-auto rounded-l-xl flex flex-row items-start justify-start`}
            >
              <button
                className="flex-1 rounded-l-xl border-teal-600 border  flex flex-row items-center justify-center py-2.5 px-4 gap-[8px]"
                onClick={() => {
                  setzero01(true);
                  setzero5(false);
                  setzeroOne(false);
                }}
              >
                <div className="relative leading-[16px] font-medium">0.1%</div>
              </button>
            </div>

            <div
              className={`${
                zero5 ? "bg-teal-600 text-white" : "text-teal-600"
              } flex-1 md:h-auto flex flex-row items-start justify-start ml-[-1px]`}
            >
              <button
                className="flex-1 flex flex-row items-center justify-center py-2.5 px-4 gap-[8px] border-[1px] border-solid border-teal-600"
                onClick={() => {
                  setzero01(false);
                  setzero5(true);
                  setzeroOne(false);
                }}
              >
                <div className="relative leading-[16px] font-medium">0.5%</div>
              </button>
            </div>

            <div
              className={`${
                zeroOne ? "bg-teal-600 text-white" : "text-teal-600"
              } flex-1 rounded-r-xl  md:h-auto flex flex-row items-start justify-start ml-[-1px]`}
            >
              <button
                className="flex-1   flex flex-row rounded-r-2xl items-center justify-center py-2.5 px-4 gap-[8px] border-[1px] border-solid border-teal-600"
                onClick={() => {
                  setzero01(false);
                  setzero5(false);
                  setzeroOne(true);
                }}
              >
                <div className="relative leading-[16px] font-medium">1.0%</div>
              </button>
            </div>
          </div>
          <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-[8px] text-sm text-gray-600">
            <button className="self-stretch rounded-2xl flex flex-row items-center justify-start py-2.5 px-4  border-[1px] border-solid border-gray-400 ">
              {zero01 ? (
                <div className="flex-1 relative leading-[20px] font-medium">
                  0.1%
                </div>
              ) : (
                ""
              )}
              {zero5 ? (
                <div className="flex-1 relative leading-[20px] font-medium">
                  0.5%
                </div>
              ) : (
                ""
              )}
              {zeroOne ? (
                <div className="flex-1 relative leading-[20px] font-medium">
                  1%
                </div>
              ) : (
                ""
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-center gap-[10px]">
        <div className="self-stretch relative leading-[24px] font-medium">
          Transaction deadline (mins)
        </div>
        <div className="w-[268px] flex flex-col items-start justify-center gap-[8px] text-sm text-greys-blue-gray-600">
          <div className="self-stretch relative leading-[20px] font-medium hidden">
            Form title
          </div>
          <div className="self-stretch rounded-2xl flex flex-row items-center justify-start py-2.5 px-4 gap-[8px] border-[1px] border-solid border-greys-blue-gray-400">
            <div className="flex-1 relative leading-[20px] font-medium">
              <input
                type="text"
                placeholder="20"
                onChange={(e) => {
                  setDeadlineTime(parseInt(e.target.value));
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch relative bg-gray-200 box-border h-px border-[1px] border-solid border-gray-200" />
      <div className="self-stretch flex flex-row items-start justify-center text-sm text-white">
        <div className="flex-1 rounded-3xl flex flex-row items-center justify-center">
          <button
            className="flex-1 rounded-3xl bg-teal-600 flex flex-row items-center justify-center p-4 lg:gap-[8px]"
            onClick={() => {
              setOpenSettings(false);
              setSetting(false);
            }}
          >
            <div className="relative leading-[20px] font-medium">Confirm</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
