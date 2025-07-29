import React from 'react'
import Image from 'next/image'

function Hero() {
  return (
      <section className="bg-gray-50 flex items-center flex-col">
  <div className="mx-auto max-w-screen-xl px-4 py-32">
    <div className="max-w-prose text-left">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Understand user flow and
        <strong className="text-primary"> increase </strong>
        conversions
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
        accusamus impedit minima harum corporis iusto.
      </p>

      <div className="mt-4 flex gap-4 sm:mt-6">
        <a
          className="inline-block rounded border border-primary bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          href="#"
        >
          Get Started
        </a>

        <a
          className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          href="#"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
  <Image src='/dashboard.png' alt='dashboard'
  width={1000}
  height={700}
  className='mt-5 rounded-xl border-2'
  priority
  />
</section>
  )
}

export default Hero
