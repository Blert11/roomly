// Listing Model
// Defines the structure and mock data for apartment listings
// In a real app, this model would fetch data from an API

const ListingModel = {
  // Get all listings
  getAll: () => {
    return [
      {
        id: "1",
        title: "Cozy Studio in Downtown",
        price: "$850/mo",
        location: "123 Main St, Downtown",
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
        description:
          "A bright and cozy studio apartment in the heart of downtown. Close to public transit, restaurants, and shops. Includes utilities and high-speed internet. Perfect for a student or young professional.",
      },
      {
        id: "2",
        title: "Spacious 2BR Near Campus",
        price: "$1,200/mo",
        location: "456 Oak Ave, University District",
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
        description:
          "Spacious two-bedroom apartment just a 5-minute walk from campus. Shared kitchen and living room. Laundry in building. Great natural light and quiet neighborhood.",
      },
      {
        id: "3",
        title: "Modern Loft with Rooftop",
        price: "$1,500/mo",
        location: "789 Elm St, Midtown",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        description:
          "A stylish modern loft with access to a shared rooftop terrace. Open floor plan, hardwood floors, and stainless steel appliances. Pet-friendly building with gym access.",
      },
      {
        id: "4",
        title: "Affordable Room in Shared House",
        price: "$550/mo",
        location: "321 Pine Rd, Westside",
        image:
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
        description:
          "Private room in a friendly shared house with 3 other roommates. Shared bathroom, kitchen, and backyard. Utilities included. Close to bus lines and grocery stores.",
      },
    ];
  },

  // Get a single listing by id
  getById: (id) => {
    const all = ListingModel.getAll();
    return all.find((listing) => listing.id === id) || null;
  },
};

export default ListingModel;
