import { Card, CardContent } from '../components/ui/card';
import { Play, Star } from 'lucide-react';

const FeaturedContent = () => {
  const featuredMovies = [
    {
      title: 'Neon Dreams',
      genre: 'Sci-Fi Thriller',
      rating: '9.2',
      image: 'https://plus.unsplash.com/premium_photo-1674718013659-6930c469e641?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmVvbnxlbnwwfHwwfHx8MA%3D%3D?w=400&h=600&fit=crop'
    },
    {
      title: 'Cyber Chronicles',
      genre: 'Action Drama',
      rating: '8.8',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&h=600&fit=crop'
    },
    {
      title: 'Digital Horizons',
      genre: 'Mystery',
      rating: '9.0',
      image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=400&h=600&fit=crop'
    },
    {
      title: 'Virtual Reality',
      genre: 'Adventure',
      rating: '8.5',
      image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop'
    }
  ];

  const tvShows = [
    {
      title: 'Tech Wars',
      genre: 'Drama Series',
      rating: '9.1',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=600&fit=crop'
    },
    {
      title: 'Future Legends',
      genre: 'Fantasy',
      rating: '8.9',
      image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop'
    },
    {
      title: 'Code Breakers',
      genre: 'Thriller',
      rating: '8.7',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop'
    },
    {
      title: 'Space Odyssey',
      genre: 'Sci-Fi',
      rating: '9.3',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop'
    }
  ];

  const ContentCard = ({ item }: { item: any }) => (
    <Card className="glass-card group cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-neon-pink/80 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-1 glass-card px-2 py-1 rounded">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-white text-sm font-semibold">{item.rating}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
        <p className="text-white/60 text-sm">{item.genre}</p>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 px-4 bg-[#2c2234]">
      <div className="container mx-auto space-y-16">
        {/* Featured Movies */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-orbitron font-bold text-white">
              Featured <span className="text-neon-pink">Movies</span>
            </h2>
            <p className="text-white/70 text-lg">Discover the latest blockbusters and classics</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie, index) => (
              <div key={movie.title} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <ContentCard item={movie} />
              </div>
            ))}
          </div>
        </div>

        {/* Featured TV Shows */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-orbitron font-bold text-white">
              Popular <span className="text-neon-purple">TV Shows</span>
            </h2>
            <p className="text-white/70 text-lg">Binge-watch the most addictive series</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tvShows.map((show, index) => (
              <div key={show.title} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <ContentCard item={show} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
