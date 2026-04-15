import { Car } from "lucide-react";
import { Link } from "react-router";

export function Onboarding() {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row lg:items-center lg:justify-center">
      {/* App Name Centered */}
      <div className="inset-0 flex items-center justify-center border-b-70 border-primary m-[0px] bg-primary lg:hidden"></div>

      {/* Content Section */}
      <div className="flex-1 px-6 pt-12 pb-10 flex flex-col items-center text-center lg:max-w-lg lg:mx-auto">
        {/* Red Car Icon */}
        <div className="mb-8 pt-20 flex flex-row lg:pt-10">
          <h1 className="text-black text-5xl font-bold tracking-tight pl-[20px] pr-[0px] pt-[40px] pb-[0px] lg:text-6xl">
            GoRide
          </h1>
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg mx-[8px] my-[20px] bg-primary lg:w-24 lg:h-24">
            <Car
              className="w-10 h-10 text-white lg:w-12 lg:h-12"
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* <div className="flex-1 px-6 pt-12 pb-10 flex flex-col items-center text-center">
          {/* <h1 className="text-black text-5xl font-bold tracking-tight pt-10">
            GoRide
          </h1> */}
        {/* </div>  */}

        {/* Main Text */}
        <h2 className="text-primary text-3xl font-semibold max-w-sm mx-[0px] mt-[25px] mb-[0px] lg:text-4xl lg:max-w-md">
          Peça uma carona em minutos
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-base max-w-md leading-relaxed mx-[0px] mt-[25px] mb-[0px] lg:text-lg">
          Viaje com segurança e economia. Conecte-se com
          motoristas verificados da sua região.
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Terms Text */}
        <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-sm lg:text-sm">
          Ao continuar, você concorda com os{" "}
          <a
            href="#"
            className="font-medium underline text-primary"
          >
            Termos de Uso
          </a>{" "}
          e{" "}
          <a
            href="#"
            className="font-medium underline text-primary"
          >
            Política de Privacidade
          </a>
        </p>

        {/* Continue Button */}
        <Link to="/login" className="w-full max-w-sm">
          <button className="w-full py-4 rounded-xl font-semibold text-primary bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition-all duration-200">
            Continuar
          </button>
        </Link>
      </div>
    </div>
  );
}