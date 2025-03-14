import React from 'react'
import { Link } from 'react-router-dom';
export default function hero() {
    return (
        <div>
            <div class="flex bg-slate-900 h-[10vh] w-full justify-between">
                <div class="flex">
                    <div class="h-[5vh] ml-3 my-auto w-[2.4vw] flex justify-center bg-slate-400 rounded-full"><i class="fa-solid fa-user my-auto "></i></div>
                    <h1 class="font-bold text-xl ml-3 my-auto text-white">WELCOME USER !!</h1>
                </div>
                <div class="flex mr-2">
                    <Link class="font-semibold h-[5vh] w-[9vw] mr-[4px] my-auto text-center border-slate-100 border-[2px] transform transition-transform duration-150 active:scale-95 rounded-sm bg-slate-200" to="/">
                        Log Out<i class="fa-solid fa-arrow-right-from-bracket my-auto ml-2"></i>
                    </Link>
                </div>
            </div>
            <div>
                <div>
                    <img src="https://i.ibb.co/BCFNPyH/IMG-20241027-200502.png" alt="E-Vidya" border="0" class="h-[50vh] mx-auto mt-2"></img>
                </div>
                <div class="flex justify-around">
                    <div class="h-[18vh] w-[30vw] bg-slate-500 flex transform transition-transform duration-150 active:scale-95"><p class="text-white text-2xl font-bold m-auto"><i class="fa-solid fa-id-card mr-3"></i>Check Attendance</p></div>
                    <div class="h-[18vh] w-[30vw] bg-slate-500 flex transform transition-transform duration-150 active:scale-95"><p class="text-white text-2xl font-bold m-auto"><i class="fa-solid fa-graduation-cap mr-3"></i>Scholarship Status</p></div>
                    <div class="h-[18vh] w-[30vw] bg-slate-500 flex transform transition-transform duration-150 active:scale-95"><p class="text-white text-2xl font-bold m-auto"><i class="fa-solid fa-building-columns mr-2"></i> Academic Score</p></div>
                </div>
                <div class="flex justify-around mt-2">
                    <Link to={"/Viewann"} class="h-[18vh] w-[30vw] bg-slate-500 flex transform transition-transform duration-150 active:scale-95"><p class="text-white text-2xl font-bold m-auto"><i class="fa-solid fa-bullhorn mr-2"></i> Announcements</p></Link>
                    <Link to={"/Viewmat"} class="h-[18vh] w-[30vw] bg-slate-500 flex transform transition-transform duration-150 active:scale-95"><p class="text-white text-2xl font-bold m-auto"><i class="fa-solid fa-book mr-2"></i> Study Material</p></Link>
                    <div class="h-[18vh] w-[30vw] bg-slate-500 flex transform transition-transform duration-150 active:scale-95"><p class="text-white text-2xl font-bold m-auto"><i class="fa-solid fa-paper-plane mr-2"></i> Mail Box</p></div>
                </div>
            </div>
        </div>
    );
}