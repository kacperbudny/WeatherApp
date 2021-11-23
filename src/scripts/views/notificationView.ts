export default class NotificationView {
  showNotification = (message: string): void => {
    const notification = document.createElement("div");
    notification.className = "notification";

    const header = document.createElement("h6");
    header.innerText = "Oops!";
    notification.appendChild(header);

    const paragraph = document.createElement("p");
    paragraph.innerText = message;
    notification.appendChild(paragraph);

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.innerText = "X";
    closeButton.onclick = () => {
      this.closeNotification(notification);
    };

    notification.appendChild(closeButton);
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.bottom = "0px";
    }, 0);

    setTimeout(() => {
      this.closeNotification(notification);
    }, 5000);
  };

  closeNotification = (element: HTMLElement): void => {
    element.style.bottom = "-100px";
    setTimeout(() => {
      element.remove();
    }, 500);
  };
}
