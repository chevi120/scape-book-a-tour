import { Building2, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface PropertyDetailsProps {
  propertyName: string;
  roomType: string;
  onBack: () => void;
}

const roomData: Record<string, Record<string, {
  matterportUrl: string;
  description: string;
  features: string[];
}>> = {
  "Scape Melbourne Central": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "A modern studio apartment perfect for students who value privacy and independence.",
      features: ["Ensuite bathroom", "Kitchenette with appliances", "Study desk and chair", "Built-in storage", "High-speed Wi-Fi"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Share your space with a fellow student while enjoying modern amenities.",
      features: ["Two single beds", "Shared ensuite bathroom", "Shared study spaces", "Individual storage", "Common kitchenette"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Fully accessible accommodation designed for comfort and independence.",
      features: ["Wheelchair accessible", "Adapted bathroom", "Emergency support system", "Adjustable fixtures", "Ground floor access"]
    }
  },
  "Scape Swanston": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Premium studio living in the heart of Melbourne's CBD.",
      features: ["Ensuite bathroom", "Full kitchenette", "Study desk", "Ample storage", "City views"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Modern twin share room with quality fittings and shared amenities.",
      features: ["Two beds", "Shared bathroom", "Study areas", "Storage spaces", "Shared kitchen"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Accessible studio with full amenities and support features.",
      features: ["Fully accessible", "Adapted facilities", "Support system", "Mobility friendly", "Safety features"]
    }
  },
  "Scape Carlton": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Boutique studio accommodation in vibrant Carlton.",
      features: ["Private ensuite", "Kitchenette", "Study space", "Storage", "Character features"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Twin share room in the heart of Carlton's cafe precinct.",
      features: ["Two beds", "Shared facilities", "Study desks", "Storage", "Common areas"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Accessible room with full support and modern amenities.",
      features: ["Wheelchair friendly", "Adapted bathroom", "Support features", "Easy access", "Safety systems"]
    }
  },
  "Scape Queensberry": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Contemporary studio at the CBD edge with modern conveniences.",
      features: ["Ensuite bathroom", "Kitchenette", "Study desk", "Built-in wardrobe", "Wi-Fi included"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Share a modern room with another student in this convenient location.",
      features: ["Two beds", "Shared ensuite", "Study spaces", "Storage", "Shared kitchen"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Fully accessible accommodation with comprehensive support.",
      features: ["Accessible design", "Adapted facilities", "Emergency support", "Wide doorways", "Safety features"]
    }
  },
  "Scape Sydney Central": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Central Sydney studio with modern amenities and city access.",
      features: ["Private ensuite", "Kitchenette", "Study area", "Storage space", "High-speed internet"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Twin share room in Sydney's CBD, perfect for students.",
      features: ["Two beds", "Shared bathroom", "Study desks", "Storage", "Common areas"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Accessible room with full facilities and support systems.",
      features: ["Wheelchair accessible", "Adapted bathroom", "Support systems", "Easy access", "Safety features"]
    }
  },
  "Scape Redfern": {
    "Signature Plus Twin Apartment": {
      matterportUrl: "https://my.matterport.com/show/?m=By2559kffM6",
      description: "Premium twin apartment in trendy Redfern, featuring signature finishes and modern amenities designed for shared student living.",
      features: ["Two separate bedrooms", "Shared ensuite bathroom", "Full kitchenette with appliances", "Study desks in each room", "Spacious living area", "High-speed Wi-Fi", "Built-in storage"]
    },
    "5 Bed Apartment": {
      matterportUrl: "https://my.matterport.com/show/?m=CAM6Q1dPJWQ",
      description: "Large five-bedroom apartment perfect for students seeking a vibrant community living experience in Redfern.",
      features: ["Five private bedrooms", "Shared bathrooms", "Large common kitchen", "Communal living and dining area", "Study spaces", "Individual storage", "High-speed Wi-Fi", "Social atmosphere"]
    },
    "Signature Plus Studio Apartment": {
      matterportUrl: "https://my.matterport.com/show/?m=wVbFCraeJkd",
      description: "Premium studio apartment with signature finishes, offering independent living in the heart of Redfern.",
      features: ["Private ensuite bathroom", "Full kitchenette", "Premium fixtures and fittings", "Study desk and ergonomic chair", "Built-in wardrobe", "High-speed Wi-Fi", "Modern appliances"]
    },
    "Ultra Studio Apartment": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Spacious ultra studio with contemporary design and premium amenities, providing the ultimate student living experience.",
      features: ["Extra spacious layout", "Premium ensuite bathroom", "Full kitchen with dishwasher", "Large study area", "Ample storage space", "High-speed Wi-Fi", "Quality finishes", "City or courtyard views"]
    }
  },
  "Scape Cleveland": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Premium studio with high-quality finishes in Redfern.",
      features: ["Private ensuite", "Modern kitchenette", "Study desk", "Wardrobe storage", "Premium amenities"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Contemporary twin share with premium facilities.",
      features: ["Two beds", "Shared ensuite", "Study areas", "Storage spaces", "Shared kitchen"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Premium accessible room with full support systems.",
      features: ["Wheelchair friendly", "Adapted facilities", "24/7 support", "Easy access", "Safety systems"]
    }
  },
  "Scape Brisbane Adelaide": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Modern CBD studio near QUT with city convenience.",
      features: ["Ensuite bathroom", "Kitchenette", "Study space", "Storage", "City access"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Twin share room in Brisbane's CBD with modern amenities.",
      features: ["Two beds", "Shared bathroom", "Study desks", "Storage", "Common areas"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Accessible accommodation with comprehensive support.",
      features: ["Fully accessible", "Adapted bathroom", "Support systems", "Easy access", "Safety features"]
    }
  },
  "Scape South Bank": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "South Bank studio with parkland and river views.",
      features: ["Private ensuite", "Kitchenette", "Study area", "Storage", "Parkland access"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Twin share in the cultural precinct of South Bank.",
      features: ["Two beds", "Shared ensuite", "Study spaces", "Storage", "Common kitchen"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Accessible room with modern facilities and support.",
      features: ["Wheelchair accessible", "Adapted facilities", "Support systems", "Easy access", "Safety features"]
    }
  },
  "Scape Adelaide Central": {
    "Studio": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Central Adelaide studio with modern student amenities.",
      features: ["Ensuite bathroom", "Kitchenette", "Study desk", "Storage", "City location"]
    },
    "Twin Share": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Twin share accommodation in Adelaide's CBD.",
      features: ["Two beds", "Shared bathroom", "Study desks", "Storage", "Common areas"]
    },
    "Accessible": {
      matterportUrl: "https://my.matterport.com/show/?m=xt9CN3F3M5H",
      description: "Accessible studio with full support and modern amenities.",
      features: ["Fully accessible", "Adapted bathroom", "Support systems", "Easy access", "Safety features"]
    }
  }
};

const propertyData: Record<string, {
  city: string;
  address: string;
  url: string;
}> = {
  "Scape Melbourne Central": {
    city: "Melbourne",
    address: "441 Elizabeth St, Melbourne VIC 3000",
    url: "https://www.scape.com.au/melbourne/scape-melbourne-central/"
  },
  "Scape Swanston": {
    city: "Melbourne",
    address: "336 Swanston St, Melbourne VIC 3000",
    url: "https://www.scape.com.au/melbourne/scape-swanston/"
  },
  "Scape Carlton": {
    city: "Melbourne",
    address: "377 Cardigan St, Carlton VIC 3053",
    url: "https://www.scape.com.au/melbourne/scape-carlton/"
  },
  "Scape Queensberry": {
    city: "Melbourne",
    address: "10 Queensberry St, Melbourne VIC 3000",
    url: "https://www.scape.com.au/melbourne/scape-queensberry/"
  },
  "Scape Sydney Central": {
    city: "Sydney",
    address: "48 Wentworth Ave, Sydney NSW 2000",
    url: "https://www.scape.com.au/sydney/scape-sydney-central/"
  },
  "Scape Redfern": {
    city: "Sydney",
    address: "770-772 Bourke St, Redfern NSW 2016",
    url: "https://www.scape.com.au/sydney/scape-redfern/"
  },
  "Scape Cleveland": {
    city: "Sydney",
    address: "33-55 Cleveland St, Redfern NSW 2016",
    url: "https://www.scape.com.au/sydney/scape-cleveland/"
  },
  "Scape Brisbane Adelaide": {
    city: "Brisbane",
    address: "458 Adelaide St, Brisbane QLD 4000",
    url: "https://www.scape.com.au/brisbane/scape-brisbane-adelaide/"
  },
  "Scape South Bank": {
    city: "Brisbane",
    address: "18 Merivale St, South Brisbane QLD 4101",
    url: "https://www.scape.com.au/brisbane/scape-south-bank/"
  },
  "Scape Adelaide Central": {
    city: "Adelaide",
    address: "242 Waymouth St, Adelaide SA 5000",
    url: "https://www.scape.com.au/adelaide/scape-adelaide-central/"
  }
};

export function PropertyDetails({ propertyName, roomType, onBack }: PropertyDetailsProps) {
  const property = propertyData[propertyName];
  const room = roomData[propertyName]?.[roomType];

  if (!property || !room) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Room details not available</p>
        <Button onClick={onBack} className="mt-4 bg-[#00B7BD] hover:bg-[#00A5AB] text-white">
          Back to Confirmation
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Banner with Property and Room Type */}
      <div className="bg-gradient-to-r from-[#ff007f] to-[#ff4d94] text-white p-4 sm:p-6 flex-shrink-0">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-[#00B7BD] hover:text-[#00B7BD] hover:bg-[#00B7BD]/10 mb-3 sm:mb-4 -ml-2 bg-white/90"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Confirmation
        </Button>
        <h2 className="text-xl sm:text-2xl mb-2">{propertyName}</h2>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{property.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{roomType}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Matterport Virtual Tour */}
        <div className="w-full bg-black aspect-video min-h-[250px] sm:min-h-[300px] lg:min-h-[400px] flex-shrink-0">
          <iframe
            src={room.matterportUrl}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
            title={`${propertyName} - ${roomType} Virtual Tour`}
            className="w-full h-full"
          />
        </div>

        {/* Room Content */}
        <div className="p-4 sm:p-6">
          <div className="space-y-5 sm:space-y-6">
            {/* Address */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Address</h3>
              <p className="text-sm sm:text-base">{property.address}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">About This Room</h3>
              <p className="text-sm leading-relaxed">{room.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-3">Room Features</h3>
              <ul className="space-y-2">
                {room.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f] mt-1.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* External Link */}
            <div className="pt-2 pb-4">
              <a
                href={property.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#ff007f] hover:text-[#ff007f]/80 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <span>View full property details on Scape website</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
