
import About from './pages/About'
import Downloader from './pages/Downloader'
const PublicRoutes = [
   
    {
        path: "",
        element: <Downloader />,
    },
    {
        path:"/about",
        element: <About />
    },
]



export default PublicRoutes