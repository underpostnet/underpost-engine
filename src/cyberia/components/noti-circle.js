const notiData = {
  'noti-count-total': 0,
  'noti-count-chat': 0,
};

const renderNotiCircleChat = () => {
  notiData['noti-count-total']++;
  notiData['noti-count-chat']++;
  htmls('.noti-count-total', notiData['noti-count-total']);
  htmls('.noti-count-chat', notiData['noti-count-chat']);
  s('.noti-circle-chat').style.display = 'block';
  s('.noti-circle-total').style.display = 'block';
};

const resetNotiCircleChat = () => {
  notiData['noti-count-total'] = notiData['noti-count-total'] - notiData['noti-count-chat'];
  if (notiData['noti-count-total'] === 0) s('.noti-circle-total').style.display = 'none';
  notiData['noti-count-chat'] = 0;
  s('.noti-circle-chat').style.display = 'none';
};
