import { PageProps as BasePageProps } from "maishu-chitu-react";

export interface PageProps extends BasePageProps {
    data: {
        resourceId: string,
    }
}
