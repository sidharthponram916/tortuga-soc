<template>
  <div class = 'flex items-center justify-center'>
    <div class="mx-auto w-1/3 bg-slate-200 mt-16 p-4">
      <div class="text-center text-3xl font-bold mb-5">Register</div>
      <div class="text-center">
        <input
          type="text"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none focus:border-2 focus:border-yellow-500"
          placeholder="Username"
        />
      </div>
      <div class="text-center">
        <input
          type="email"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none focus:border-2 focus:border-yellow-500"
          placeholder="Terpmail ID"
        />
      </div>
      <div class="text-center">
        <input
          type="password"
          class="p-2 m-2 bg-white w-11/12 rounded outline-none focus:border-2 focus:border-yellow-500"
          placeholder="Password"
        />
      </div>
      <div class="text-center">
        <button class="p-2 m-2 bg-red-700 font-semibold w-11/12 rounded text-white mt-5">
          Sign Up
        </button>
      </div>
    </div>
  </div>
</template>