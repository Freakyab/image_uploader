import { toast } from 'react-toastify';

export const handleToast = (message: string, type: string) => {
    if(type === "success"){
        toast.success(message);
    }else if(type === "error"){
        toast.error(message);
    }
    else {
        toast.info(message);
    }
}
