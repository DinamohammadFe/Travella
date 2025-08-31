import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url('https://i.postimg.cc/fyJs5RLn/beach-2562563-1920.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto ${isVisible ? 'fade-in' : 'opacity-0'}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Life is a Journey Not a Destination
            </h1>
            <p className="text-xl md:text-2xl mb-12 font-light italic">
              Explore the World with us.
            </p>
            
            {/* Search Form */}
            <div className="w-full max-w-6xl mx-auto px-4">
              {/* Search Card */}
              <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-6">
                {/* Search Fields */}
                <div className="flex flex-col md:flex-row md:items-center w-full gap-4 md:gap-0">
                  {/* From */}
                  <div className="flex items-center flex-1 min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg md:border-0 md:p-0">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <input type="text" placeholder="From" className="w-full text-gray-800 text-sm focus:outline-none" />
                  </div>
                  
                  {/* Divider */}
                  <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
                  
                  {/* To */}
                  <div className="flex items-center flex-1 min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg md:border-0 md:p-0">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <input type="text" placeholder="To" className="w-full text-gray-800 text-sm focus:outline-none" />
                  </div>
                  
                  {/* Divider */}
                  <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
                  
                  {/* Departure Date */}
                  <div className="flex items-center flex-1 min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg md:border-0 md:p-0">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input type="date" className="w-full text-gray-800 text-sm focus:outline-none" />
                  </div>
                  
                  {/* Divider */}
                  <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
                  
                  {/* Return Date */}
                  <div className="flex items-center flex-1 min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg md:border-0 md:p-0">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input type="date" className="w-full text-gray-800 text-sm focus:outline-none" />
                  </div>
                  
                  {/* Divider */}
                  <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
                  
                  {/* Travellers */}
                  <div className="flex items-center flex-1 min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg md:border-0 md:p-0">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <select className="w-full text-gray-800 text-sm focus:outline-none bg-transparent">
                      <option>1 Adult, Economy</option>
                      <option>2 Adults, Economy</option>
                      <option>1 Adult, Business</option>
                      <option>2 Adults, Business</option>
                    </select>
                  </div>
                  
                  {/* Search Button */}
                  <Link
                    to="/planner"
                    className="flex items-center justify-center px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm w-full md:w-auto md:ml-4 mt-4 md:mt-0"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">Travella</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning with our innovative features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className={`card text-center group hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Planning</h3>
              <p className="text-gray-600">AI-powered recommendations tailored to your preferences and budget.</p>
            </div>
            
            <div className={`card text-center group hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Coverage</h3>
              <p className="text-gray-600">Discover amazing destinations across 50+ countries worldwide.</p>
            </div>
            
            <div className={`card text-center group hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">Compare prices across multiple platforms to get the best deals.</p>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className={`bg-gradient-to-r from-primary-50 to-teal-50 rounded-2xl p-8 ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">25K+</div>
                <div className="text-gray-600">Trips Planned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">4.9★</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Top Destinations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
            <p className="text-sm font-semibold text-teal-600 mb-2 tracking-wider uppercase">DESTINATION</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Top Destination
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
             {/* United States */}
              <div className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
                 <div className="h-64 relative overflow-hidden rounded-2xl">
                   <img 
                     src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80" 
                     alt="United States" 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                     <h3 className="text-2xl font-bold mb-2">United States</h3>
                     <p className="text-white/90 text-base">250 Cities</p>
                   </div>
                 </div>
               </div>
            
            {/* United Kingdom */}
               <div className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                 <div className="h-64 relative overflow-hidden rounded-2xl">
                   <img 
                     src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                     alt="United Kingdom" 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                     <h3 className="text-2xl font-bold mb-2">United Kingdom</h3>
                     <p className="text-white/90 text-base">120 Cities</p>
                   </div>
                 </div>
               </div>
               
               {/* Australia */}
               <div className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                 <div className="h-64 relative overflow-hidden rounded-2xl">
                   <img 
                     src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                     alt="Australia" 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                     <h3 className="text-2xl font-bold mb-2">Australia</h3>
                     <p className="text-white/90 text-base">70 Cities</p>
                   </div>
                 </div>
               </div>
            
            {/* India */}
             <div className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
               <div className="h-64 relative overflow-hidden rounded-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                   alt="India" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                   <h3 className="text-2xl font-bold mb-2">India</h3>
                   <p className="text-white/90 text-base">100 Cities</p>
                 </div>
               </div>
             </div>
             
             {/* South Africa */}
             <div className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
               <div className="h-64 relative overflow-hidden rounded-2xl">
                 <img 
                   src="https://i.postimg.cc/0jTY3RR5/elephants-1065632-1920.jpg" 
                   alt="South Africa" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                   <h3 className="text-2xl font-bold mb-2">South Africa</h3>
                   <p className="text-white/90 text-base">50 Cities</p>
                 </div>
               </div>
             </div>
             
             {/* Indonesia */}
             <div className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-105 ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
               <div className="h-64 relative overflow-hidden rounded-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                   alt="Indonesia" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                   <h3 className="text-2xl font-bold mb-2">Indonesia</h3>
                   <p className="text-white/90 text-base">80 Cities</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home