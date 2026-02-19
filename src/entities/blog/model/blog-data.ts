export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string[]; // Array of paragraphs
    category: string;
    date: string;
    readTime: string;
    image: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 'methalox-future',
        title: 'Why Methalox is the Future of Rocket Propulsion',
        excerpt:
            'The aerospace industry is witnessing a paradigm shift in propellant technology. Methane-oxygen (Methalox) propulsion offers a unique combination of high performance, cost-effectiveness, and reusability.',
        content: [
            "The aerospace industry is witnessing a paradigm shift in propellant technology. For decades, highly refined kerosene (RP-1) and liquid hydrogen (LH2) have dominated launch vehicle propulsion. However, a new contender has emerged to claim the throne: liquid methane and liquid oxygen, collectively known as Methalox.",
            "Methalox offers a 'Goldilocks' solution for modern rocketry. Unlike hydrogen, liquid methane is relatively dense and easy to store at manageable cryogenic temperatures, allowing for smaller, lighter fuel tanks. Unlike kerosene, it burns incredibly cleanly, leaving minimal soot or residue in the engine. This clean-burning characteristic is the holy grail for reusable rockets, as it drastically reduces the refurbishment time needed between flights.",
            "At Trishul Space, our Amulya and Harpy engine series are designed around this revolutionary propellant combination. The specific impulse (Isp) of Methalox is superior to kerosene, giving our launch vehicles greater payload capacity to orbit. Furthermore, methane is abundant and cheap, helping us drive down the cost per kilogram of payload to space.",
            "Looking further ahead, Methalox enables the vision of becoming a multi-planetary species. Methane can be synthesized on Mars using the Sabatier process, utilizing subsurface water ice and atmospheric carbon dioxide. This means future explorers won't need to bring return fuel with them—they can manufacture it on the Red Planet. By mastering Methalox technology today, we are laying the groundwork for the deep space missions of tomorrow.",
        ],
        category: 'Technology',
        date: 'Dec 28, 2025',
        readTime: '8 min read',
        image: '/blog-methalox.png',
    },
    {
        id: 'indian-space-startup',
        title: 'Building a Space Startup in India: Our Journey',
        excerpt:
            'What began as a passionate group of IIT Delhi students dreaming of rockets has evolved into one of India\'s most promising private space ventures. This is the story of Trishul Space.',
        content: [
            "What began as a passionate group of IIT Delhi students dreaming of rockets has evolved into one of India's most promising private space ventures. Trishul Space wasn't built in a boardroom; it was born in university labs, fueled by caffeine, code, and an unshakeable belief that India could lead the next generation of launch technology.",
            "Our journey has been anything but a straight line. We faced early skepticism—building orbital-class rockets is notoriously capital-intensive and technically unforgiving. Our first few prototypes failed. We dealt with plumbing leaks, sensor malfunctions, and the unique challenge of navigating a regulatory landscape that was just beginning to open up to private players.",
            "The turning point came when we secured our pre-seed funding, allowing us to move from simulations to hardware. Setting up our test stand was a lesson in grit. We welded structures ourselves, wrote our own control software, and spent countless nights troubleshooting avionics. But when Amulya-1 roared to life for the first time, every sleepless night felt worth it.",
            "Today, we are proud to be part of India's booming space ecosystem. With the support of ISRO's IN-SPACe initiative and our mentors at IIT Delhi, we are accelerating towards our first orbital launch. We are not just building a company; we are building a legacy of indigenous innovation that proves Indian engineering can compete on the global stage.",
        ],
        category: 'Company',
        date: 'Dec 15, 2025',
        readTime: '6 min read',
        image: '/blog-startup.png',
    },
    {
        id: 'static-fire-test',
        title: 'Inside Our First Static Fire Test',
        excerpt:
            'December 2024 marked a defining moment for Trishul Space: the successful static fire test of our Amulya-1 engine. A behind-the-scenes look at the 15 seconds that validated years of work.',
        content: [
            "December 2024 marked a defining moment for Trishul Space: the successful static fire test of our Amulya-1 engine. For the uninitiated, a static fire test involves strapping the rocket engine to a fortified ground stand and firing it at full power while it remains stationary. It is the ultimate examination of an engine's design before it attempts flight.",
            "The preparation began weeks in advance. Our team meticulously inspected every valve, seal, and sensor. We ran hundreds of 'cold flow' tests, pushing liquid nitrogen through the system to verify that the plumbing could withstand cryogenic temperatures and high pressures without leaking. The day of the test was a symphony of controlled chaos. The countdown was held twice due to sensor anomalies, testing our team's patience and discipline.",
            "At T-minus zero, the ignition sequence began. A flash of green TEB (Triethylborane) ignited the chamber, followed instantly by the roar of combustion. For 15 seconds, Amulya-1 generated its full rated thrust, shaking the ground and sending a plume of exhaust into the sky. The data streamed back to our control bunker in real-time, showing nominal chamber pressure and stable combustion.",
            "This success was more than just fire and noise; it was data validation. Our thermal models matched reality within 2%. Our injector geometry proved stable. We walked away with a working engine and a mountain of data that has directly informed the design of our next-generation Harpy engine.",
        ],
        category: 'Engineering',
        date: 'Nov 30, 2025',
        readTime: '10 min read',
        image: '/blog-static-fire.png',
    },
    {
        id: 'staged-combustion',
        title: 'Understanding Staged Combustion Cycles',
        excerpt:
            'Staged combustion represents the pinnacle of liquid rocket engine efficiency. In this deep technical dive, we break down why preburners are the key to unlocking higher chamber pressures.',
        content: [
            "Staged combustion represents the pinnacle of liquid rocket engine efficiency, achieving specific impulse values that push the boundaries of chemical propulsion. Unlike the simpler gas-generator cycle, where a portion of propellant is burned just to spin the pumps and then dumped overboard, staged combustion uses every drop of fuel to generate thrust.",
            "In our fuel-rich staged combustion cycle (used in the Harpy engine), a small amount of oxidizer is burned with a large amount of fuel in a 'preburner.' This creates a hot (but not too hot!) gas that drives the turbine. Crucially, this exhaust gas is still rich in unburned fuel. Instead of venting it, we pipe it directly into the main combustion chamber to be burned again with the remaining oxidizer.",
            "This closed-loop architecture allows for incredibly high combustion chamber pressures. Higher pressure means we can use a smaller, more efficient nozzle to extract more energy from the propellant. The result is a lighter, more powerful engine that is perfect for the first stage of a launch vehicle.",
            "Mastering this cycle is difficult. It requires complex metallurgy to handle the hot, high-pressure gases and precise control systems to balance the flows. However, the payoff is worth it: an engine that squeezes maximum performance out of every kilogram of propellant.",
        ],
        category: 'Education',
        date: 'Nov 18, 2025',
        readTime: '12 min read',
        image: '/blog-staged-combustion.png',
    },
    {
        id: 'iit-collaboration',
        title: 'Partnering with IIT Delhi for R&D Excellence',
        excerpt:
            'Innovation thrives at the intersection of academic research and industry ambition. Our strategic partnership with IIT Delhi has become the cornerstone of Trishul Space capabilities.',
        content: [
            "Innovation thrives at the intersection of academic research and industry ambition. Our strategic partnership with IIT Delhi has become the cornerstone of Trishul Space's research and development capabilities. It provides us with access to world-class laboratories, high-performance computing resources, and, most importantly, a pipeline of brilliant young minds.",
            "Through this collaboration, we have been able to leverage advanced wind tunnels for aerodynamic testing and supercomputers for Computational Fluid Dynamics (CFD) simulations. These tools, usually prohibitively expensive for a startup, allow us to iterate on our designs with speed and precision.",
            "But it goes beyond equipment. We are actively working with professors and research scholars on cutting-edge problems in combustion instability and material science. We also offer internships and research projects to students, giving them real-world experience in aerospace engineering.",
            "This symbiotic relationship ensures that we stay at the bleeding edge of technology while helping to nurture the next generation of India's aerospace pioneers. We believe that the walls between academia and industry should be porous, allowing ideas to flow freely and ignite innovation.",
        ],
        category: 'Company',
        date: 'Nov 5, 2025',
        readTime: '5 min read',
        image: '/blog-iit-partnership.png',
    },
    {
        id: 'reusability-design',
        title: 'Designing for Reusability from Day One',
        excerpt:
            'Reusability isn\'t a feature you bolt on at the end — it\'s a philosophy. At Trishul Space, we\'ve architected our engines with rapid reuse as a core requirement.',
        content: [
            "Reusability isn't a feature you bolt on at the end—it's a philosophy that must permeate every design decision from the first sketch. At Trishul Space, we've architected our engines with rapid reuse as a core requirement, not an afterthought. We aren't just building rockets; we are building an airline-like operation for space.",
            "This philosophy drives our material choices. We use advanced superalloys that can withstand repeated thermal cycling without degrading. We design our turbopumps with modularity in mind, allowing for easy access and inspection between flights. If a part takes too long to inspect, we redesign it.",
            "We are also investing heavily in health monitoring sensors. Our engines are covered in sensors that track vibration, temperature, and pressure in real-time. This data allows us to predict maintenance needs before they become failures, enabling a 'condition-based maintenance' approach similar to modern jet engines.",
            "Our target is a 24-hour turnaround time for our upper stages. It's an ambitious goal, but one that is necessary to dramatically lower the cost of access to space. By making rockets reusable, we transform spaceflight from a rare, expensive event into a routine logistical operation.",
        ],
        category: 'Engineering',
        date: 'Oct 22, 2025',
        readTime: '9 min read',
        image: '/blog-reusability.png',
    },
];

/**
 * Pre-computed Map for O(1) blog post lookup by ID
 * @description Use this instead of Array.find() for better performance
 */
export const blogPostsMap = new Map<string, BlogPost>(
    blogPosts.map(post => [post.id, post])
);

/**
 * Get a blog post by ID with O(1) lookup
 * @param id - The blog post ID
 * @returns The blog post or undefined if not found
 */
export function getBlogPostById(id: string | undefined): BlogPost | undefined {
    if (!id) return undefined;
    const post = blogPostsMap.get(id);
    if (!post) {
        console.warn(`[Blog] Post not found: ${id}`);
    }
    return post;
}
