export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8]">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      ></div>
      
      <div className="relative container mx-auto px-4 py-24">
        <div className="flex justify-center items-center">
          {/* Hero Content */}
          <div className="text-white text-center max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to<br />
              <span className="text-[#fcd34d]">Tuskers CC</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              Passionate cricket, extraordinary talent, and unwavering dedication. 
              Join us as we continue our journey to excellence on and off the field.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
