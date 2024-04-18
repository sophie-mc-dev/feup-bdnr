import json
import random

topics = [
    "Technology", "Music", "Art", "Sports", "Food & Drink",
    "Business", "Science", "Health & Wellness", "Education", "Environment",
    "Fashion", "Travel", "Automotive", "Pets", "Gaming",
    "Home & Garden", "Books", "Movies & Film", "Theater", "Dance",
    "Photography", "Design", "Crafts", "Parenting", "Social Justice",
    "History", "Literature", "Comedy", "Fitness", "Yoga",
    "Meditation", "Beauty", "Shopping", "Finance", "Real Estate"
]
adjectives = ["Innovative", "Sensational", "Magical", "Epic", "Enchanting", "Whimsical", "Dazzling", "Mystical", "Radiant", "Marvelous"]
types = ["Festival", "Conference", "Seminar", "Webinar", "Workshop", "Concert", "Exhibition", "Marathon", "Fair", "Gala", "Expo"]

 # Map of topics to categories
topic_to_categories = {
    "Technology": ["Technology", "Innovation", "Science"],
    "Music": ["Music", "Concert", "Entertainment"],
    "Art": ["Art", "Creativity", "Design"],
    "Sports": ["Sports", "Fitness", "Competition"],
    "Food & Drink": ["Food & Drink", "Culinary", "Tastings"],
    "Business": ["Business", "Entrepreneurship", "Networking"],
    "Health & Wellness": ["Health & Wellness", "Fitness"],
    "Education": ["Education", "Learning", "Development"],
    "Environment": ["Environment", "Sustainability", "Green Living"],
    "Fashion": ["Fashion", "Style", "Design"],
    "Travel": ["Travel", "Adventure", "Exploration"],
    "Automotive": ["Automotive", "Cars", "Vehicles"],
    "Pets": ["Pets", "Animals", "Pet Care"],
    "Gaming": ["Gaming", "Video Games"],
    "Home & Garden": ["Home & Garden", "DIY", "Lifestyle"],
    "Books": ["Books", "Literature", "Reading"],
    "Movies & Film": ["Movies & Film", "Cinema"],
    "Theater": ["Theater", "Drama", "Performing Arts"],
    "Dance": ["Dance"],
    "Photography": ["Photography", "Visual Arts"],
    "Design": ["Design", "Creativity", "Innovation"],
    "Crafts": ["Crafts", "DIY", "Handmade"],
    "Parenting": ["Parenting", "Family", "Children"],
    "Social Justice": ["Social Justice", "Activism"],
    "History": ["History", "Heritage"],
    "Literature": ["Literature", "Writing"],
    "Comedy": ["Comedy", "Humor", "Stand-up"],
    "Yoga": ["Yoga", "Mindfulness", "Well-being"],
    "Meditation": ["Meditation", "Mindfulness", "Spirituality"],
    "Beauty": ["Beauty", "Makeup"],
    "Shopping": ["Shopping", "Retail", "Sales"],
    "Finance": ["Finance", "Investing"],
    "Real Estate": ["Real Estate", "Property", "Housing"]
}

# Function to generate all possible event names and corresponding categories
def generate_events():
    events = []
    for topic in topics:
        for type in types:
            for adjective in adjectives:
                event_name = f"{adjective} {topic} {type}"
                categories = generate_event_categories(event_name)
                description = generate_event_description(event_name)
                ticket_types = generate_ticket_types(event_name)
                events.append({
                    "event_name": event_name,
                    "description": description,
                    "categories": list(set(categories)), 
                    "ticket_types": ticket_types
                })
    random.shuffle(events)
    return events

# Function to generate categories according to the event name
def generate_event_categories(event_name): 
    words = event_name.split()
    event_topic = words[1]

    return topic_to_categories.get(event_topic, [])

# Function to generate event description according to its name
def generate_event_description(event_name):
    event_words = event_name.split()
    
    if "Festival" in event_words:
        templates = [
            "Celebrate the spirit of our community at our festival. Join us for a vibrant celebration filled with music, art, food, and culture that promises fun and excitement for all.",
            "Experience the magic of our festival as we bring together diverse traditions, flavors, and performances. From lively parades to immersive experiences, get ready for a memorable celebration.",
            "Immerse yourself in the festive atmosphere of our event. With activities for all ages and interests, our festival is a celebration of joy, creativity, and togetherness."
        ]
    elif "Conference" in event_words:
        templates = [
            "Engage with thought leaders and innovators at our conference. Explore cutting-edge ideas, gain insights from industry experts, and network with peers in a dynamic environment.",
            "Join us for a conference that pushes boundaries and sparks new perspectives. With insightful talks, interactive workshops, and networking opportunities, our event is a catalyst for growth and inspiration.",
            "Participate in our conference and be part of shaping the future. From thought-provoking discussions to hands-on workshops, our event offers a platform for learning, collaboration, and innovation."
        ]
    elif "Seminar" in event_words:
        templates = [
            "Expand your knowledge and skills at our seminar. With expert speakers and engaging discussions, our event offers valuable insights and practical strategies to help you succeed.",
            "Join us for a seminar designed to inform, inspire, and empower. From industry trends to personal development, our event covers topics that matter and equips you for success.",
            "Participate in our seminar and gain fresh perspectives on key issues and challenges. With interactive sessions and expert guidance, our event is a platform for learning, growth, and professional development."
        ]
    elif "Webinar" in event_words:
        templates = [
            "Join us for an informative webinar that you can attend from the comfort of your own home. Gain valuable knowledge, interact with speakers, and connect with a global audience.",
            "Participate in our webinar and stay ahead of the curve with the latest insights and trends. Whether you're a seasoned professional or new to the field, our event offers valuable takeaways for everyone.",
            "Attend our webinar and engage with industry experts from around the world. With convenient online access and interactive sessions, our event is a valuable opportunity to learn and grow."
        ]
    elif "Marathon" in event_words:
        templates = [
            "Challenge yourself and join us for an exhilarating marathon. Whether you're a seasoned runner or new to the sport, our event offers a thrilling experience and a sense of accomplishment.",
            "Experience the thrill of pushing your limits at our marathon. With scenic routes and enthusiastic supporters, our event is more than a race—it's a journey of determination, perseverance, and triumph.",
            "Participate in our marathon and be part of a community united by a shared passion for running. From first-timers to seasoned athletes, our event welcomes participants of all levels."
        ]
    elif "Fair" in event_words:
        templates = [
            "Explore a world of wonders at our fair. From carnival games to artisanal crafts, our event offers something for everyone to enjoy. Join us for a day of fun, laughter, and unforgettable memories.",
            "Join us for a fair that celebrates the richness of our community. With local vendors, delicious food, and entertaining performances, our event is a celebration of diversity, creativity, and togetherness.",
            "Experience the magic of our fair, where imagination knows no bounds. From thrilling rides to whimsical attractions, our event promises excitement and adventure for all ages."
        ]
    elif "Expo" in event_words:
        templates = [
            "Explore the latest innovations and trends at our expo. From groundbreaking technologies to cutting-edge products, our event showcases the future of industry and commerce.",
            "Join us for an expo that brings together industry leaders, entrepreneurs, and innovators. With interactive exhibits and networking opportunities, our event is a hub of inspiration and collaboration.",
            "Experience the excitement of our expo as we showcase the best and brightest in innovation and creativity. Whether you're a business professional or technology enthusiast, our event offers valuable insights and opportunities."
        ]
    elif "Concert" in event_words:
        templates = [
            "Immerse yourself in a night of electrifying performances at our concert. Get ready to dance, sing along, and create unforgettable memories with fellow music lovers.",
            "Experience the magic of live music at our concert. From soulful melodies to upbeat rhythms, our event promises to take you on a musical journey like no other.",
            "Join us for a concert that will captivate your senses and leave you craving for more. Let the music transport you to a world of harmony, rhythm, and pure joy."
        ]
    elif "Exhibition" in event_words:
        templates = [
            "Step into a realm of artistic brilliance at our exhibition. Discover a diverse collection of works that will inspire, provoke thought, and ignite your imagination.",
            "Explore the beauty of creativity at our exhibition. From paintings to sculptures and installations, our event showcases the power of artistic expression in all its forms.",
            "Immerse yourself in a visual feast at our exhibition. Let the colors, shapes, and textures of the artworks take you on a journey of wonder, contemplation, and awe."
        ]
    elif "Gala" in event_words:
        templates = [
            "Dress to impress and join us for a glamorous evening at our gala. Indulge in exquisite cuisine, enjoy live entertainment, and support a worthy cause in style.",
            "Celebrate in elegance and sophistication at our gala. From champagne toasts to live music and auctions, our event promises an unforgettable night of luxury and generosity.",
            "Join us for a night of opulence and enchantment at our gala. Experience the magic of a formal affair filled with fine dining, entertainment, and charitable giving."
        ]
    elif "Workshop" in event_words:
        templates = [
            "Expand your skills and unleash your creativity at our workshop. Engage in hands-on activities, learn from experts, and develop new talents in a supportive environment.",
            "Join us for a workshop that will ignite your passion and inspire your innovation. Gain practical knowledge, collaborate with peers, and take your abilities to the next level.",
            "Participate in a transformative workshop designed to empower and energize. Dive into interactive sessions, explore new techniques, and unlock your full potential."
        ]
    else:
        templates = [
            "Experience a one-of-a-kind event that brings together enthusiasts and professionals from diverse backgrounds. Join us for an unforgettable journey filled with excitement, inspiration, and meaningful connections.",
            "Step into a world where creativity, innovation, and community converge. Our event is a celebration of passion, talent, and collaboration that promises to leave you inspired and energized.",
            "Discover a gathering like no other, where ideas flourish, friendships blossom, and dreams take flight. Join us for a memorable experience that celebrates the spirit of exploration, creativity, and camaraderie."
        ]
    return random.choice(templates)

# Function to generate ticket types
def generate_ticket_types(event_name):
    ticket_prices = {}

    if "Festival" in event_name:
        ticket_prices = {
            "General Admission": 50,
            "VIP Pass": 100,
            "Student Ticket": 30
        }
    elif "Conference" in event_name:
        ticket_prices = {
            "Standard Pass": 200,
            "Premium Pass": 350,
            "Student Ticket": 100  # Students get a discount
        }
    elif "Seminar" in event_name:
        ticket_prices = {
            "Regular Ticket": 50,
            "VIP Ticket": 150  
        }
    elif "Webinar" in event_name:
        ticket_prices = {
            "Free Admission": 0,  
            "Premium Access": 50  
        }
    elif "Marathon" in event_name:
        ticket_prices = {
            "5K Race": 40,
            "10K Race": 50,
            "Half Marathon": 60,
            "Full Marathon": 80 
        }
    elif "Fair" in event_name:
        ticket_prices = {
            "Adult Ticket": 20,
            "Child Ticket": 10 
        }
    elif "Expo" in event_name:
        ticket_prices = {
            "Visitor Pass": 30,
            "VIP Access": 150  
        }
    elif "Concert" in event_name:
        ticket_prices = {
            "General Admission": 70,
            "VIP Ticket": 200  
        }
    elif "Exhibition" in event_name:
        ticket_prices = {
            "Standard Entry": 40,
            "VIP Experience": 100  
        }
    elif "Gala" in event_name:
        ticket_prices = {
            "Single Ticket": 200,
            "Couples Ticket": 350  
        }
    elif "Workshop" in event_name:
        ticket_prices = {
            "Participant Pass": 50  
        }
    else:
        # Default ticket prices for unspecified events
        ticket_prices = {
            "Standard Ticket": 100,
            "Premium Ticket": 200  
        }
    
    # Format ticket types and prices into the desired structure
    ticket_types = []
    for ticket_type, price in ticket_prices.items():
        ticket_types.append({
            "type": ticket_type,
            "price": price,
            "available_tickets": random.randint(1, 100)  # Random number of available tickets
        })

    return ticket_prices


if __name__ == "__main__":
    # Step 1:  Generate the events
    events = generate_events()

    # Step 2: Write the events to a JSON file
    with open('./input_data/events.json', 'w') as json_file:
        json.dump(events, json_file, indent=2)

    print("JSON file with all possible event combinations generated and saved to the input_data folder.")