import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Brisbane Premium?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience luxury transport with our premium fleet and professional drivers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background p-6 rounded-lg border border-border flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Safety First</h3>
                <p className="text-muted-foreground">
                  All our vehicles are regularly maintained and our drivers are professionally trained to ensure your safety.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-background p-6 rounded-lg border border-border flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Punctuality</h3>
                <p className="text-muted-foreground">
                  We value your time. Our drivers arrive ahead of schedule to ensure you reach your destination on time, every time.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-background p-6 rounded-lg border border-border flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Drivers</h3>
                <p className="text-muted-foreground">
                  Our drivers are professional, courteous, and knowledgeable about Brisbane and surrounding areas.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From airport transfers to corporate events, we offer a wide range of premium transport services
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Service 1 */}
              <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600&h=400" 
                    alt="Airport Transfer" 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Airport Transfers</h3>
                  <p className="text-muted-foreground mb-4">Reliable and comfortable transfers to and from Brisbane Airport.</p>
                  <a href="/services/airport" className="text-primary font-medium hover:underline flex items-center">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Service 2 */}
              <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1564545455884-40fdb04456e6?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600&h=400" 
                    alt="Corporate Travel" 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Corporate Travel</h3>
                  <p className="text-muted-foreground mb-4">Impress your clients with our premium corporate transport services.</p>
                  <a href="/services/corporate" className="text-primary font-medium hover:underline flex items-center">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Service 3 */}
              <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1563215351-6450f7586170?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600&h=400" 
                    alt="Special Events" 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Special Events</h3>
                  <p className="text-muted-foreground mb-4">Make your special occasion truly memorable with our luxury vehicles.</p>
                  <a href="/services/events" className="text-primary font-medium hover:underline flex items-center">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-secondary text-secondary-foreground">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Premium Travel?</h2>
                <p className="mb-6 text-secondary-foreground/80">
                  Book your next journey with Brisbane Premium Transfers and discover the difference that premium service makes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium">
                    Book Now
                  </a>
                  <a href="/contact" className="inline-block bg-transparent border border-secondary-foreground/30 text-secondary-foreground px-6 py-3 rounded-md font-medium">
                    Contact Us
                  </a>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1602700429203-94a073208ddc?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=800&h=600" 
                  alt="Premium Service" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
